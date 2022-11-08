package com.group9.puzzledfitness.models;

import javax.persistence.*;
import java.util.*;


@Entity
@Table
public class Routine {
    private List<List<Workout>> workouts;

    //default empty constructor
    public Routine(){
        workouts = new ArrayList<List<Workout>>();
    }

    //passing in a set routine
    public Routine(ArrayList<List<Workout>> w){
        workouts = new ArrayList<>(w);
    }

    //returns a set of workouts 
    public List<Workout> getRoutine(int d){
        return workouts.get(d);
    }

    public void setRoutine(List<Workout> w, int d){
        workouts.add(d, w);
    }

}
