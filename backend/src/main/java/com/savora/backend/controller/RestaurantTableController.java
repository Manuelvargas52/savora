
package com.savora.backend.controller;


import com.savora.backend.repository.RestaurantTableRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/tables")
@CrossOrigin(origins = "http://localhost:5173")
public class RestaurantTableController {

    private final RestaurantTableRepository restaurantTableRepository;

    public RestaurantTableController(
            RestaurantTableRepository restaurantTableRepository) {
        this.restaurantTableRepository = restaurantTableRepository;
    }

    @GetMapping
    public ResponseEntity<List<RestaurantTableResponse>> getRestaurantTables(
            @PathVariable Long restaurantId) {
        List<RestaurantTableResponse> tables = restaurantTableRepository
                .findByRestaurantIdAndActiveTrue(restaurantId)
                .stream()
                .map(table -> new RestaurantTableResponse(
                        table.getId(),
                        table.getTableNumber(),
                        table.getCapacity(),
                        table.getActive()))
                .toList();

        return ResponseEntity.ok(tables);
    }

    public record RestaurantTableResponse(
            Long id,
            Integer tableNumber,
            Integer capacity,
            Boolean active) {
    }
}
