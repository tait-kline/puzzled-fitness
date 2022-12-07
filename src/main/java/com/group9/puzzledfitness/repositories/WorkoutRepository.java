package com.group9.puzzledfitness.repositories;

import com.group9.puzzledfitness.models.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    //
    @Query(value = "SELECT * FROM workout WHERE account_id = ?1", nativeQuery = true)
    List<Workout> findAllByAccountId(long accountId);
}
