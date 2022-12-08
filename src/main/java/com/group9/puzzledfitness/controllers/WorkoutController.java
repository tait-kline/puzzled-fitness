package com.group9.puzzledfitness.controllers;

import com.group9.puzzledfitness.models.Account;
import com.group9.puzzledfitness.models.Workout;
import com.group9.puzzledfitness.services.AccountService;
import com.group9.puzzledfitness.services.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Controller
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;
    @Autowired
    private AccountService accountService;
    private Principal principal;


    @GetMapping("/")
    public String getAllUserWorkouts(Model model, Principal principal) {
        Optional<Account> account = accountService.findByEmail(principal.getName());
        if (account.isPresent()) {
            Account userAccount = account.get();
            List<Workout> workouts = workoutService.getAllByUserId(userAccount.getId());
            model.addAttribute("workouts", workouts);

            int targetWorkouts = userAccount.getGoal();
            int progressPct;
            if (targetWorkouts > 0) {
                progressPct = workouts.size() > targetWorkouts? 100 : (int)Math.ceil((workouts.size() *100) / targetWorkouts);
            } else {
                progressPct = 0;
            }

            model.addAttribute("progress", progressPct);
            model.addAttribute("workoutGoal", targetWorkouts);
        }
        return "home";
    }

    @PostMapping("/add-goal")
    public String addGoal(@ModelAttribute Account viewAccount, Principal principal) {
        Optional<Account> optAccount = accountService.findByEmail(principal.getName());
        if (optAccount.isPresent()) {
            Account userAccount = optAccount.get();
            viewAccount.setPassword(userAccount.getPassword());
            viewAccount.setAuthorities(userAccount.getAuthorities());
            viewAccount.setWorkouts(userAccount.getWorkouts());
            viewAccount.setFirstName(userAccount.getFirstName());
            viewAccount.setId(userAccount.getId());
            viewAccount.setLastName(userAccount.getLastName());
            viewAccount.setEmail(userAccount.getEmail());
            accountService.save(viewAccount);
            return "redirect:/";
        }
        return "404";
    }

    @GetMapping("/add-goal")
    public String addGoal(Principal principal, Model model) {
        Account account = new Account();
        model.addAttribute("account", account);
        return "add-goal";
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

    @GetMapping("/workouts/{id}/delete")
    public String deleteWorkout(@PathVariable Long id) {
        Optional<Workout> optionalWorkout = workoutService.getById(id);
        if (optionalWorkout.isPresent()) {
            Workout workout = optionalWorkout.get();
            workoutService.delete(workout);
            return "redirect:/";
        } else {
            return "404";
        }
    }

    @GetMapping("workouts/new")
    public String createNewWorkout(Model model, Principal principal) {
        Optional<Account> optionalAccount = accountService.findByEmail(principal.getName());
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
        return "redirect:/";
    }
}
