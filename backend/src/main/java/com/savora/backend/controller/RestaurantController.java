
package com.savora.backend.controller;

import com.savora.backend.entity.Restaurant;
import com.savora.backend.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:5173")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    // Consultar todos los restaurantes activos
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(
                restaurantService.getAllRestaurants()
        );
    }

    // Consultar un restaurante por ID
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                restaurantService.getRestaurantById(id)
        );
    }

    // Consultar restaurantes por categoría
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Restaurant>> getRestaurantsByCategory(
            @PathVariable String category
    ) {
        return ResponseEntity.ok(
                restaurantService.getRestaurantsByCategory(category)
        );
    }

    // Buscar restaurantes por nombre
    @GetMapping("/search")
    public ResponseEntity<List<Restaurant>> searchRestaurants(
            @RequestParam String name
    ) {
        return ResponseEntity.ok(
                restaurantService.searchRestaurants(name)
        );
    }
}
