package com.cloud.user.controller;

import com.cloud.common.core.R;
import com.cloud.user.entity.UserInfo;
import com.cloud.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public R<List<UserInfo>> list() {
        return R.ok(userService.list());
    }

    @GetMapping("/{id}")
    public R<UserInfo> getById(@PathVariable Long id) {
        return R.ok(userService.getById(id));
    }

    @PostMapping("/register")
    public R<Boolean> register(@RequestBody UserInfo user) {
        return R.ok(userService.register(user));
    }

    @PostMapping("/login")
    public R<String> login(@RequestBody UserInfo user) {
        String token = userService.login(user);
        return R.ok(token);
    }
}
