package com.savora.backend.controller;

import com.savora.backend.dto.ReservationResponse;
import com.savora.backend.service.ReservationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

        private final ReservationService reservationService;

        public ReservationController(ReservationService reservationService) {
                this.reservationService = reservationService;
        }

        // 1. Consultar todas las reservas
        @GetMapping
        public ResponseEntity<List<ReservationResponse>> getAllReservations() {
                return ResponseEntity.ok(
                                reservationService.getAllReservations());
        }

        // 2. Consultar una reserva por ID
        @GetMapping("/{id}")
        public ResponseEntity<ReservationResponse> getReservationById(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                reservationService.getReservationById(id));
        }

        // 3. Consultar reservas de un restaurante
        @GetMapping("/restaurant/{restaurantId}")
        public ResponseEntity<List<ReservationResponse>> getReservationsByRestaurant(
                        @PathVariable Long restaurantId) {

                return ResponseEntity.ok(
                                reservationService.getReservationsByRestaurant(restaurantId));
        }

        // 4. Consultar reservas de un cliente
        @GetMapping("/customer/{customerId}")
        public ResponseEntity<List<ReservationResponse>> getReservationsByCustomer(
                        @PathVariable Long customerId) {

                return ResponseEntity.ok(
                                reservationService.getReservationsByCustomer(customerId));
        }

        // 5. Consultar reservas por correo electrónico
        @GetMapping("/customer/email")
        public ResponseEntity<List<ReservationResponse>> getReservationsByCustomerEmail(
                        @RequestParam String email) {

                return ResponseEntity.ok(
                                reservationService.getReservationsByCustomerEmail(email));
        }

        // 6. Consultar reservas por fecha
        @GetMapping("/date/{date}")
        public ResponseEntity<List<ReservationResponse>> getReservationsByDate(
                        @PathVariable LocalDate date) {

                return ResponseEntity.ok(
                                reservationService.getReservationsByDate(date));
        }

        // 7. Consultar horarios disponibles
        @GetMapping("/available-times")
        public ResponseEntity<List<LocalTime>> getAvailableTimes(
                        @RequestParam Long restaurantId,
                        @RequestParam LocalDate date,
                        @RequestParam Integer guests,
                        @RequestParam Long excludeReservationId) {

                return ResponseEntity.ok(
                                reservationService.getAvailableTimes(
                                                restaurantId,
                                                date,
                                                guests,
                                                excludeReservationId));
        }

        // 8. Crear una reserva
        @PostMapping
        public ResponseEntity<ReservationResponse> createReservation(
                        @RequestBody CreateReservationRequest request) {

                ReservationResponse reservation = reservationService.createReservation(
                                request.restaurantId(),
                                request.fullName(),
                                request.email(),
                                request.phone(),
                                request.date(),
                                request.time(),
                                request.guests(),
                                request.comments());

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(reservation);
        }

        // 9. Cancelar una reserva
        @PatchMapping("/{id}/cancel")
        public ResponseEntity<ReservationResponse> cancelReservation(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                reservationService.cancelReservation(id));
        }

        // 10. Modificar una reserva
        @PutMapping("/{id}")
        public ResponseEntity<ReservationResponse> updateReservation(
                        @PathVariable Long id,
                        @RequestBody UpdateReservationRequest request) {

                ReservationResponse reservation = reservationService.updateReservation(
                                id,
                                request.date(),
                                request.time(),
                                request.guests(),
                                request.comments());

                return ResponseEntity.ok(reservation);
        }

        // Datos para crear una reserva
        public record CreateReservationRequest(
                        Long restaurantId,
                        String fullName,
                        String email,
                        String phone,
                        LocalDate date,
                        LocalTime time,
                        Integer guests,
                        String comments) {
        }

        // Datos para modificar una reserva
        public record UpdateReservationRequest(
                        LocalDate date,
                        LocalTime time,
                        Integer guests,
                        String comments) {
        }
}