package com.group9.puzzledfitness.controllers;

import com.group9.puzzledfitness.models.Account;
import com.group9.puzzledfitness.models.Workout;
import com.group9.puzzledfitness.services.AccountService;
import com.group9.puzzledfitness.services.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.Optional;

@Controller
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;
    @Autowired
    private AccountService accountService;

    @GetMapping("/")
    public String getAllWorkouts(Model model) {
        List<Workout> workouts = workoutService.getAll();
        model.addAttribute("workouts", workouts);
        return "home";
    }

    @GetMapping("/workouts/{id}")
    public String getWorkout(@PathVariable Long id, Model model) {
        Optional<Workout> optionalWorkout = workoutService.getById(id);
        if (optionalWorkout.isPresent()) {
            Workout workout = optionalWorkout.get();
            model.addAttribute("workout", workout);
            return "workout";
        } else {
            return "404";
        }
    }

    @GetMapping("workouts/new")
    public String createNewWorkout(Model model) {
        Optional<Account> optionalAccount = accountService.findByEmail("user1@domain.com");
        if (optionalAccount.isPresent()) {
            Workout workout = new Workout();
            workout.setAccount(optionalAccount.get());
            model.addAttribute("workout", workout);
            return "workout_new";
        } else {
            return "404";
        }
    }

    @PostMapping("/workouts/new")
    public String saveNewWorkout(@ModelAttribute Workout workout) {
        workoutService.save(workout);
        return "redirect:/workouts/" + workout.getId();
    }
}
