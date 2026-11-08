
package com.savora.backend.repository;

import com.savora.backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    List<Restaurant> findByActiveTrue();

    List<Restaurant> findByCategoryIgnoreCase(String category);

    List<Restaurant> findByNameContainingIgnoreCase(String name);
}
