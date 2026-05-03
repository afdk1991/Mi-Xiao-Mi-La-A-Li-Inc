package com.cloud.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloud.common.core.R;
import com.cloud.system.entity.SysAdmin;
import com.cloud.system.mapper.SysAdminMapper;
import com.cloud.system.service.SysAdminService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class SysAdminServiceImpl extends ServiceImpl<SysAdminMapper, SysAdmin>
    implements SysAdminService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public SysAdmin login(String username, String password) {
        QueryWrapper<SysAdmin> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        SysAdmin admin = this.getOne(queryWrapper);

        if (admin == null) {
            throw new RuntimeException("用户不存在");
        }

        if (admin.getStatus() == 0) {
            throw new RuntimeException("账号已被禁用");
        }

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        admin.setLastLoginTime(new Date());
        admin.setLastLoginIp("127.0.0.1");
        this.updateById(admin);

        return admin;
    }

    @Override
    public SysAdmin getAdminById(Long id) {
        SysAdmin admin = this.getById(id);
        if (admin != null) {
            admin.setPassword(null);
        }
        return admin;
    }

    @Override
    public boolean updatePassword(Long id, String oldPassword, String newPassword) {
        SysAdmin admin = this.getById(id);
        if (admin == null) {
            throw new RuntimeException("用户不存在");
        }

        if (!passwordEncoder.matches(oldPassword, admin.getPassword())) {
            throw new RuntimeException("原密码错误");
        }

        admin.setPassword(passwordEncoder.encode(newPassword));
        return this.updateById(admin);
    }

    @Override
    public List<SysAdmin> getAdminList(Integer page, Integer pageSize, String keyword) {
        QueryWrapper<SysAdmin> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("create_time");

        if (keyword != null && !keyword.isEmpty()) {
            queryWrapper.and(w -> w.like("username", keyword)
                    .or().like("nickname", keyword)
                    .or().like("phone", keyword));
        }

        queryWrapper.eq("deleted", 0);
        return this.list(queryWrapper);
    }

    @Override
    public boolean addAdmin(SysAdmin admin) {
        QueryWrapper<SysAdmin> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", admin.getUsername());
        if (this.count(queryWrapper) > 0) {
            throw new RuntimeException("用户名已存在");
        }

        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setCreateTime(new Date());
        admin.setUpdateTime(new Date());
        admin.setDeleted(0);
        return this.save(admin);
    }

    @Override
    public boolean updateAdmin(SysAdmin admin) {
        admin.setUpdateTime(new Date());
        if (admin.getPassword() != null && !admin.getPassword().isEmpty()) {
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        }
        return this.updateById(admin);
    }

    @Override
    public boolean deleteAdmin(Long id) {
        SysAdmin admin = this.getById(id);
        if (admin != null) {
            admin.setDeleted(1);
            admin.setUpdateTime(new Date());
            return this.updateById(admin);
        }
        return false;
    }

    @Override
    public boolean updateStatus(Long id, Integer status) {
        SysAdmin admin = this.getById(id);
        if (admin != null) {
            admin.setStatus(status);
            admin.setUpdateTime(new Date());
            return this.updateById(admin);
        }
        return false;
    }
}
