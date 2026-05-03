package com.cloud.system.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cloud.system.entity.SysAdmin;

import java.util.List;

public interface SysAdminService extends IService<SysAdmin> {

    SysAdmin login(String username, String password);

    SysAdmin getAdminById(Long id);

    boolean updatePassword(Long id, String oldPassword, String newPassword);

    List<SysAdmin> getAdminList(Integer page, Integer pageSize, String keyword);

    boolean addAdmin(SysAdmin admin);

    boolean updateAdmin(SysAdmin admin);

    boolean deleteAdmin(Long id);

    boolean updateStatus(Long id, Integer status);
}
