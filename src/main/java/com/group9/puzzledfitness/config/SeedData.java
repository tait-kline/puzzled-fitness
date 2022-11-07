package com.group9.puzzledfitness.config;

import com.group9.puzzledfitness.models.Workout;
import com.group9.puzzledfitness.services.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SeedData implements CommandLineRunner {

    @Autowired
    private WorkoutService workoutService;

    @Override
    public void run(String... args) throws Exception {
        List<Workout> workouts = workoutService.getAll();

        if (workouts.size() == 0) {
            Workout workout1 = new Workout();
            workout1.setTitle("Workout 1 Title");
            workout1.setNotes("Workout 1 Notes");
            workout1.setIntensityLevel(1);

            Workout workout2 = new Workout();
            workout2.setTitle("Workout 2 Title");
            workout2.setNotes("Workout 2 Notes");
            workout2.setIntensityLevel(2);

            workoutService.save(workout1);
            workoutService.save(workout2);

        }
    }

}
