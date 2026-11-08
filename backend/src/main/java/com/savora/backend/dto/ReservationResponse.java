
package com.savora.backend.dto;

import com.savora.backend.entity.Reservation;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;

public record ReservationResponse(
        Long id,
        LocalDate reservationDate,
        LocalTime reservationTime,
        Integer durationMinutes,
        Integer guests,
        String status,
        String comments,
        OffsetDateTime createdAt,
        RestaurantInfo restaurant,
        TableInfo table,
        CustomerInfo customer
) {

    public static ReservationResponse from(Reservation reservation) {
        return new ReservationResponse(
                reservation.getId(),
                reservation.getReservationDate(),
                reservation.getReservationTime(),
                reservation.getDurationMinutes(),
                reservation.getGuests(),
                reservation.getStatus(),
                reservation.getComments(),
                reservation.getCreatedAt(),

                new RestaurantInfo(
                        reservation.getRestaurant().getId(),
                        reservation.getRestaurant().getName(),
                        reservation.getRestaurant().getAddress(),
                        reservation.getRestaurant().getCity(),
                        reservation.getRestaurant().getImageUrl()
                ),

                new TableInfo(
                        reservation.getTable().getId(),
                        reservation.getTable().getTableNumber(),
                        reservation.getTable().getCapacity()
                ),

                new CustomerInfo(
                        reservation.getCustomer().getId(),
                        reservation.getCustomer().getFullName(),
                        reservation.getCustomer().getEmail(),
                        reservation.getCustomer().getPhone()
                )
        );
    }

    public record RestaurantInfo(
            Long id,
            String name,
            String address,
            String city,
            String imageUrl
    ) {}

    public record TableInfo(
            Long id,
            Integer tableNumber,
            Integer capacity
    ) {}

    public record CustomerInfo(
            Long id,
            String fullName,
            String email,
            String phone
    ) {}
}
