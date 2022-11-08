package com.group9.puzzledfitness.services;

import com.group9.puzzledfitness.models.Account;
import com.group9.puzzledfitness.repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    public Account save(Account account) {
        return accountRepository.save(account);
    }
}
