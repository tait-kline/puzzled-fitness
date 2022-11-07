package com.group9.puzzledfitness.controllers;

import com.group9.puzzledfitness.models.Workout;
import com.group9.puzzledfitness.services.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class TempController {

    @Autowired
    private WorkoutService workoutService;

    @GetMapping("/")
    public String home(Model model) {
        List<Workout> workouts = workoutService.getAll();
        model.addAttribute("workouts", workouts);
        return "allworkouts";
    }
}
