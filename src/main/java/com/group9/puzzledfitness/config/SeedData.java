package com.group9.puzzledfitness.config;

import com.group9.puzzledfitness.models.Account;
import com.group9.puzzledfitness.models.Authority;
import com.group9.puzzledfitness.models.Workout;
import com.group9.puzzledfitness.models.WorkoutType;
import com.group9.puzzledfitness.repositories.AuthorityRepository;
import com.group9.puzzledfitness.services.AccountService;
import com.group9.puzzledfitness.services.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class SeedData implements CommandLineRunner {

    @Autowired
    private WorkoutService workoutService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private AuthorityRepository authorityRepository;

    @Override
    public void run(String... args) throws Exception {
        List<Workout> workouts = workoutService.getAll();

        if (workouts.size() == 0) {
            Authority user = new Authority();
            user.setName("ROLE_USER");
            authorityRepository.save(user);

            Authority admin = new Authority();
            admin.setName("ROLE_ADMIN");
            authorityRepository.save(admin);

            Account account1 = new Account();
            account1.setFirstName("user1");
            account1.setLastName("user1");
            account1.setEmail("user1@domain.com");
            account1.setPassword("password1");
            Set<Authority> authorities1 = new HashSet<>();
            authorityRepository.findById("ROLE_USER").ifPresent(authorities1::add);
            account1.setAuthorities(authorities1);

            Account account2 = new Account();
            account2.setFirstName("user2");
            account2.setLastName("user2");
            account2.setEmail("user2@domain.com");
            account2.setPassword("password2");
            Set<Authority> authorities2 = new HashSet<>();
            authorityRepository.findById("ROLE_ADMIN").ifPresent(authorities2::add);
            authorityRepository.findById("ROLE_USER").ifPresent(authorities2::add);
            account2.setAuthorities(authorities2);

            accountService.save(account1);
            accountService.save(account2);

            Workout workout1 = new Workout();
            workout1.setTitle("Workout 1 Title");
            workout1.setNotes("Workout 1 Notes");
            workout1.setIntensityLevel(1);
            workout1.setWorkoutType(WorkoutType.RUN);
            workout1.setAccount(account1);

            Workout workout2 = new Workout();
            workout2.setTitle("Workout 2 Title");
            workout2.setNotes("Workout 2 Notes");
            workout2.setIntensityLevel(2);
            workout2.setWorkoutType(WorkoutType.WEIGHTS);
            workout2.setAccount(account2);

            workoutService.save(workout1);
            workoutService.save(workout2);
        }
    }

}
