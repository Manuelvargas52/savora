
package com.savora.backend.service;

import com.savora.backend.dto.ReservationResponse;
import com.savora.backend.entity.Customer;
import com.savora.backend.entity.Reservation;
import com.savora.backend.entity.Restaurant;
import com.savora.backend.entity.RestaurantTable;
import com.savora.backend.repository.CustomerRepository;
import com.savora.backend.repository.ReservationRepository;
import com.savora.backend.repository.RestaurantRepository;
import com.savora.backend.repository.RestaurantTableRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class ReservationService {

        private final ReservationRepository reservationRepository;
        private final RestaurantRepository restaurantRepository;
        private final RestaurantTableRepository restaurantTableRepository;
        private final CustomerRepository customerRepository;

        private static final int RESERVATION_DURATION_MINUTES = 60;

        public ReservationService(
                        ReservationRepository reservationRepository,
                        RestaurantRepository restaurantRepository,
                        RestaurantTableRepository restaurantTableRepository,
                        CustomerRepository customerRepository) {

                this.reservationRepository = reservationRepository;
                this.restaurantRepository = restaurantRepository;
                this.restaurantTableRepository = restaurantTableRepository;
                this.customerRepository = customerRepository;
        }

        // 1. Consultar todas las reservas
        @Transactional(readOnly = true)
        public List<ReservationResponse> getAllReservations() {
                return reservationRepository.findAll()
                                .stream()
                                .map(ReservationResponse::from)
                                .toList();
        }

        // 2. Consultar una reserva por ID
        @Transactional(readOnly = true)
        public ReservationResponse getReservationById(Long id) {
                Reservation reservation = reservationRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Reserva no encontrada: " + id));

                return ReservationResponse.from(reservation);
        }

        // 3. Consultar reservas de un restaurante
        @Transactional(readOnly = true)
        public List<ReservationResponse> getReservationsByRestaurant(Long restaurantId) {
                return reservationRepository.findByRestaurantId(restaurantId)
                                .stream()
                                .map(ReservationResponse::from)
                                .toList();
        }

        // 4. Consultar reservas de un cliente por ID
        @Transactional(readOnly = true)
        public List<ReservationResponse> getReservationsByCustomer(Long customerId) {
                return reservationRepository.findByCustomerId(customerId)
                                .stream()
                                .map(ReservationResponse::from)
                                .toList();
        }

        // 5. Consultar reservas de un cliente por correo electrónico
        @Transactional(readOnly = true)
        public List<ReservationResponse> getReservationsByCustomerEmail(String email) {

                if (email == null || email.isBlank()) {
                        throw new IllegalArgumentException(
                                        "El correo electrónico es obligatorio.");
                }

                return customerRepository.findByEmailIgnoreCase(email.trim())
                                .map(customer -> reservationRepository
                                                .findByCustomerId(customer.getId())
                                                .stream()
                                                .map(ReservationResponse::from)
                                                .toList())
                                .orElse(List.of());
        }

        // 6. Consultar reservas por fecha
        @Transactional(readOnly = true)
        public List<ReservationResponse> getReservationsByDate(LocalDate date) {
                return reservationRepository.findByReservationDate(date)
                                .stream()
                                .map(ReservationResponse::from)
                                .toList();
        }

        // 7. Consultar horarios realmente disponibles para modificar una reserva
        @Transactional(readOnly = true)
        public List<LocalTime> getAvailableTimes(
                        Long restaurantId,
                        LocalDate date,
                        Integer guests,
                        Long excludeReservationId) {

                // Validar datos obligatorios
                if (restaurantId == null
                                || date == null
                                || guests == null
                                || excludeReservationId == null) {

                        throw new IllegalArgumentException(
                                        "Los datos para consultar disponibilidad son obligatorios.");
                }

                // Validar número de personas
                if (guests < 1 || guests > 8) {
                        throw new IllegalArgumentException(
                                        "El número de personas debe estar entre 1 y 8.");
                }

                // No consultar fechas pasadas
                if (date.isBefore(LocalDate.now())) {
                        return List.of();
                }

                // Buscar restaurante
                Restaurant restaurant = restaurantRepository.findById(restaurantId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Restaurante no encontrado."));

                // Validar que el restaurante esté activo
                if (!Boolean.TRUE.equals(restaurant.getActive())) {
                        throw new IllegalArgumentException(
                                        "El restaurante no está disponible.");
                }

                // Buscar mesas activas con capacidad suficiente
                List<RestaurantTable> tables = restaurantTableRepository
                                .findByRestaurantIdAndCapacityGreaterThanEqualAndActiveTrue(
                                                restaurantId,
                                                guests);

                if (tables.isEmpty()) {
                        return List.of();
                }

                // Lista de horarios disponibles
                List<LocalTime> availableTimes = new java.util.ArrayList<>();

                LocalTime openingTime = restaurant.getOpeningTime();
                LocalTime closingTime = restaurant.getClosingTime();

                // Duración de cada reserva: 60 minutos
                int durationMinutes = RESERVATION_DURATION_MINUTES;

                // Consultar horarios en intervalos de 30 minutos
                LocalTime time = openingTime;

                while (!time.plusMinutes(durationMinutes).isAfter(closingTime)) {

                        // Evitar horarios anteriores a la hora actual
                        if (date.equals(LocalDate.now())
                                        && !time.isAfter(LocalTime.now())) {

                                time = time.plusMinutes(30);
                                continue;
                        }

                        // Comprobar si existe al menos una mesa disponible
                        boolean hasAvailableTable = false;

                        for (RestaurantTable table : tables) {

                                boolean tableAvailable = isTableAvailableForUpdate(
                                                table.getId(),
                                                date,
                                                time,
                                                durationMinutes,
                                                excludeReservationId);

                                if (tableAvailable) {
                                        hasAvailableTable = true;
                                        break;
                                }
                        }

                        // Agregar únicamente los horarios disponibles
                        if (hasAvailableTable) {
                                availableTimes.add(time);
                        }

                        time = time.plusMinutes(30);
                }

                return availableTimes;
        }

        // 8. Comprobar disponibilidad de una mesa
        @Transactional(readOnly = true)
        public boolean isTableAvailable(
                        Long tableId,
                        LocalDate date,
                        LocalTime startTime,
                        Integer durationMinutes) {

                if (tableId == null || date == null || startTime == null
                                || durationMinutes == null || durationMinutes <= 0) {

                        throw new IllegalArgumentException(
                                        "Los datos de disponibilidad no son válidos.");
                }

                LocalTime endTime = startTime.plusMinutes(durationMinutes);

                if (!endTime.isAfter(startTime)) {
                        throw new IllegalArgumentException(
                                        "La duración de la reserva no es válida.");
                }

                List<Reservation> reservations = reservationRepository.findByTable_IdAndReservationDate(
                                tableId, date);

                for (Reservation reservation : reservations) {

                        if ("CANCELLED".equalsIgnoreCase(reservation.getStatus())) {
                                continue;
                        }

                        LocalTime existingStart = reservation.getReservationTime();

                        LocalTime existingEnd = existingStart.plusMinutes(
                                        reservation.getDurationMinutes());

                        boolean overlaps = startTime.isBefore(existingEnd)
                                        && existingStart.isBefore(endTime);

                        if (overlaps) {
                                return false;
                        }
                }

                return true;
        }

        // 9. Cancelar una reserva
        public ReservationResponse cancelReservation(Long reservationId) {

                Reservation reservation = reservationRepository.findById(reservationId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Reserva no encontrada: " + reservationId));

                if ("CANCELLED".equalsIgnoreCase(reservation.getStatus())) {
                        throw new IllegalStateException(
                                        "Esta reserva ya está cancelada.");
                }

                reservation.setStatus("CANCELLED");

                Reservation savedReservation = reservationRepository.save(reservation);

                return ReservationResponse.from(savedReservation);
        }

        // 10. Crear una reserva con asignación automática de mesa
        public ReservationResponse createReservation(
                        Long restaurantId,
                        String fullName,
                        String email,
                        String phone,
                        LocalDate date,
                        LocalTime time,
                        Integer guests,
                        String comments) {

                // Validar datos obligatorios
                if (restaurantId == null
                                || fullName == null || fullName.isBlank()
                                || email == null || email.isBlank()
                                || phone == null || phone.isBlank()
                                || date == null || time == null || guests == null) {

                        throw new IllegalArgumentException(
                                        "Todos los datos obligatorios deben estar completos.");
                }

                // Validar fecha
                if (date.isBefore(LocalDate.now())) {
                        throw new IllegalArgumentException(
                                        "No puedes realizar reservas en fechas pasadas.");
                }

                if (date.equals(LocalDate.now())
                                && !time.isAfter(LocalTime.now())) {

                        throw new IllegalArgumentException(
                                        "La hora de reserva debe ser posterior a la hora actual.");
                }

                // Validar número de personas
                if (guests < 1 || guests > 8) {
                        throw new IllegalArgumentException(
                                        "El número de personas debe estar entre 1 y 8.");
                }

                // Buscar restaurante
                Restaurant restaurant = restaurantRepository.findById(restaurantId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Restaurante no encontrado."));

                if (!Boolean.TRUE.equals(restaurant.getActive())) {
                        throw new IllegalArgumentException(
                                        "El restaurante no está disponible.");
                }

                // Duración de la reserva: 60 minutos
                int durationMinutes = RESERVATION_DURATION_MINUTES;

                LocalTime endTime = time.plusMinutes(durationMinutes);

                if (!endTime.isAfter(time)) {
                        throw new IllegalArgumentException(
                                        "La duración de la reserva no es válida.");
                }

                // Validar horario del restaurante
                if (time.isBefore(restaurant.getOpeningTime())
                                || endTime.isAfter(restaurant.getClosingTime())) {

                        throw new IllegalArgumentException(
                                        "La reserva está fuera del horario del restaurante.");
                }

                // Buscar mesas activas con capacidad suficiente
                List<RestaurantTable> availableCapacityTables = restaurantTableRepository
                                .findByRestaurantIdAndCapacityGreaterThanEqualAndActiveTrue(
                                                restaurantId, guests);

                // Ordenar mesas de menor a mayor capacidad
                List<RestaurantTable> sortedTables = availableCapacityTables.stream()
                                .sorted(Comparator.comparing(RestaurantTable::getCapacity))
                                .toList();

                // Seleccionar automáticamente la primera mesa disponible
                RestaurantTable selectedTable = sortedTables.stream()
                                .filter(table -> isTableAvailable(
                                                table.getId(),
                                                date,
                                                time,
                                                durationMinutes))
                                .findFirst()
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No hay mesas disponibles para la fecha y hora seleccionadas."));

                // Buscar o registrar cliente
                String normalizedEmail = email.trim().toLowerCase();

                Customer customer = customerRepository
                                .findByEmailIgnoreCase(normalizedEmail)
                                .orElseGet(() -> {

                                        Customer newCustomer = new Customer();

                                        newCustomer.setFullName(fullName.trim());
                                        newCustomer.setEmail(normalizedEmail);
                                        newCustomer.setPhone(phone.trim());

                                        return customerRepository.save(newCustomer);
                                });

                // Crear reserva
                Reservation reservation = new Reservation();

                reservation.setRestaurant(restaurant);
                reservation.setTable(selectedTable);
                reservation.setCustomer(customer);
                reservation.setReservationDate(date);
                reservation.setReservationTime(time);
                reservation.setDurationMinutes(durationMinutes);
                reservation.setGuests(guests);
                reservation.setStatus("PENDING");
                reservation.setComments(comments);

                // Guardar reserva
                Reservation savedReservation = reservationRepository.save(reservation);

                return ReservationResponse.from(savedReservation);
        }

        // 11. Modificar una reserva existente
        public ReservationResponse updateReservation(
                        Long reservationId,
                        LocalDate date,
                        LocalTime time,
                        Integer guests,
                        String comments) {

                // Buscar reserva
                Reservation reservation = reservationRepository.findById(reservationId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Reserva no encontrada: " + reservationId));

                // Impedir modificar reservas canceladas
                if ("CANCELLED".equalsIgnoreCase(reservation.getStatus())) {
                        throw new IllegalStateException(
                                        "No puedes modificar una reserva cancelada.");
                }

                // Validar datos obligatorios
                if (date == null || time == null || guests == null) {
                        throw new IllegalArgumentException(
                                        "La fecha, hora y cantidad de personas son obligatorias.");
                }

                // Validar fecha
                if (date.isBefore(LocalDate.now())) {
                        throw new IllegalArgumentException(
                                        "No puedes modificar la reserva a una fecha pasada.");
                }

                if (date.equals(LocalDate.now())
                                && !time.isAfter(LocalTime.now())) {

                        throw new IllegalArgumentException(
                                        "La hora de la reserva debe ser futura.");
                }

                // Validar cantidad de personas
                if (guests < 1 || guests > 8) {
                        throw new IllegalArgumentException(
                                        "El número de personas debe estar entre 1 y 8.");
                }

                Restaurant restaurant = reservation.getRestaurant();

                // Todas las reservas duran 60 minutos
                int durationMinutes = RESERVATION_DURATION_MINUTES;

                LocalTime endTime = time.plusMinutes(durationMinutes);

                // Validar horario del restaurante
                if (!endTime.isAfter(time)
                                || time.isBefore(restaurant.getOpeningTime())
                                || endTime.isAfter(restaurant.getClosingTime())) {

                        throw new IllegalArgumentException(
                                        "La reserva está fuera del horario del restaurante.");
                }

                // Buscar mesas activas con capacidad suficiente
                List<RestaurantTable> availableTables = restaurantTableRepository
                                .findByRestaurantIdAndCapacityGreaterThanEqualAndActiveTrue(
                                                restaurant.getId(), guests);

                // Ordenar mesas por capacidad
                List<RestaurantTable> sortedTables = availableTables.stream()
                                .sorted(Comparator.comparing(RestaurantTable::getCapacity))
                                .toList();

                // Buscar mesa disponible, ignorando la reserva actual
                RestaurantTable selectedTable = sortedTables.stream()
                                .filter(table -> isTableAvailableForUpdate(
                                                table.getId(),
                                                date,
                                                time,
                                                durationMinutes,
                                                reservationId))
                                .findFirst()
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No hay mesas disponibles para la fecha y hora seleccionadas."));

                // Actualizar reserva
                reservation.setTable(selectedTable);
                reservation.setReservationDate(date);
                reservation.setReservationTime(time);
                reservation.setDurationMinutes(durationMinutes);
                reservation.setGuests(guests);
                reservation.setComments(comments);

                Reservation savedReservation = reservationRepository.save(reservation);

                return ReservationResponse.from(savedReservation);
        }

        // 12. Comprobar disponibilidad ignorando la reserva que estamos modificando
        private boolean isTableAvailableForUpdate(
                        Long tableId,
                        LocalDate date,
                        LocalTime startTime,
                        Integer durationMinutes,
                        Long reservationIdToIgnore) {

                LocalTime endTime = startTime.plusMinutes(durationMinutes);

                List<Reservation> reservations = reservationRepository.findByTable_IdAndReservationDate(
                                tableId, date);

                for (Reservation existing : reservations) {

                        // Ignorar la propia reserva
                        if (existing.getId().equals(reservationIdToIgnore)) {
                                continue;
                        }

                        // Ignorar reservas canceladas
                        if ("CANCELLED".equalsIgnoreCase(existing.getStatus())) {
                                continue;
                        }

                        LocalTime existingStart = existing.getReservationTime();

                        LocalTime existingEnd = existingStart.plusMinutes(
                                        existing.getDurationMinutes());

                        boolean overlaps = startTime.isBefore(existingEnd)
                                        && existingStart.isBefore(endTime);

                        if (overlaps) {
                                return false;
                        }
                }

                return true;
        }
}
