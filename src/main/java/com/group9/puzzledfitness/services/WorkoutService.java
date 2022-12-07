package com.group9.puzzledfitness.services;

import com.group9.puzzledfitness.models.Workout;
import com.group9.puzzledfitness.repositories.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WorkoutService {
    @Autowired
    private WorkoutRepository workoutRepository;

    public Optional<Workout> getById(long id) {
        return workoutRepository.findById(id);
    }

    public List<Workout> getAll() {
        return workoutRepository.findAll();
    }

    public List<Workout> getAllByUserId(long accountId) {
        return workoutRepository.findAllByAccountId(accountId);
    }

    public Workout save(Workout workout) {
        if (workout.getId() == null) {
            workout.setDateTime(LocalDateTime.now());
        }

        return workoutRepository.save(workout);
    }
}
