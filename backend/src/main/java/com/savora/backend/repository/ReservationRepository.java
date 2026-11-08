
package com.savora.backend.repository;

import com.savora.backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Consultar reservas de un restaurante
    List<Reservation> findByRestaurantId(Long restaurantId);

    // Consultar reservas de un cliente
    List<Reservation> findByCustomerId(Long customerId);

    // Consultar reservas por fecha
    List<Reservation> findByReservationDate(LocalDate reservationDate);

    // Consultar reservas de un restaurante en una fecha
    List<Reservation> findByRestaurantIdAndReservationDate(
            Long restaurantId,
            LocalDate reservationDate
    );

    // Consultar reservas por estado
    List<Reservation> findByStatus(String status);

    // Consultar reservas de una mesa en una fecha
    List<Reservation> findByTable_IdAndReservationDate(
            Long tableId,
            LocalDate reservationDate
    );
}
