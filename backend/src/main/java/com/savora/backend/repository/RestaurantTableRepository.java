
package com.savora.backend.repository;

import com.savora.backend.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantTableRepository
        extends JpaRepository<RestaurantTable, Long> {

    List<RestaurantTable> findByRestaurantId(Long restaurantId);

    List<RestaurantTable> findByRestaurantIdAndActiveTrue(Long restaurantId);

    List<RestaurantTable> findByRestaurantIdAndCapacityGreaterThanEqualAndActiveTrue(
            Long restaurantId,
            Integer guests
    );
}
