package com.cloud.system.controller;

import com.cloud.common.core.R;
import com.cloud.system.entity.SysAdmin;
import com.cloud.system.service.SysAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class SysAdminController {

    @Autowired
    private SysAdminService adminService;

    @PostMapping("/login")
    public R<String> login(@RequestBody SysAdmin admin) {
        String token = adminService.login(admin.getUsername(), admin.getPassword());
        if (token != null) {
            return R.ok(token, "登录成功");
        }
        return R.fail("账号或密码错误");
    }

    @PostMapping("/register")
    public R<Boolean> register(@RequestBody SysAdmin admin) {
        return R.ok(adminService.register(admin), "注册成功");
    }
}
