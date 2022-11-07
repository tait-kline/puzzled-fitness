package com.group9.puzzledfitness.models;

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
    private String title;
    private String notes;
    private int intensityLevel;
    private LocalDateTime dateTime;

    public void setId(Long id) {
        this.id = id;
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

    public Long getId() {
        return id;
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
