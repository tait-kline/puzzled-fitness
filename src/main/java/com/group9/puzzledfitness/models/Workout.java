package com.group9.puzzledfitness.models;

import org.springframework.lang.NonNull;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table
public class Workout {

    @Id
    @SequenceGenerator(
            name = "workout_sequence",
            sequenceName = "workout_sequence",
            allocationSize = 1
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "account_id", referencedColumnName = "id", nullable = false)
    private Account account;
    private String title;
    private String notes;
    private int intensityLevel;
    private LocalDateTime dateTime;
    private WorkoutType workoutType;

    public void setId(Long id) {
        this.id = id;
    }

    @NonNull
    public Account getAccount() {
        return account;
    }

    public void setAccount(@NonNull Account account) {
        this.account = account;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setIntensityLevel(int intensityLevel) {
        this.intensityLevel = intensityLevel;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }
    public void setWorkoutType(WorkoutType workoutType) {
        this.workoutType = workoutType;
    }

    public Long getId() {
        return id;
    }
    public WorkoutType getWorkoutType() {
        return workoutType;
    }

    public String getTitle() {
        return title;
    }

    public String getNotes() {
        return notes;
    }

    public int getIntensityLevel() {
        return intensityLevel;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }
}
