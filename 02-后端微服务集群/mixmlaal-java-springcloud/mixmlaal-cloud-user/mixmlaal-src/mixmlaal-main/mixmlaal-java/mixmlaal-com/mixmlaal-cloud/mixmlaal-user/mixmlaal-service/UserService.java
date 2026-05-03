package com.cloud.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloud.user.entity.UserInfo;
import com.cloud.user.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public Long registerWithAccount(String account, String nickname, String password) {
        UserInfo user = new UserInfo();
        user.setAccount(account);
        user.setNickname(nickname != null ? nickname : account);
        user.setPassword(password != null ? DigestUtils.md5DigestAsHex(password.getBytes()) : null);
        user.setRegisterTime(LocalDateTime.now());
        user.setLevel(0);
        user.setBalance(java.math.BigDecimal.ZERO);
        user.setStatus(1);
        user.setDeleted(0);
        userMapper.insert(user);
        return user.getId();
    }

    public Long registerWithPhone(String phone, String nickname, String password) {
        UserInfo user = new UserInfo();
        user.setPhone(phone);
        user.setNickname(nickname != null ? nickname : "用户" + phone.substring(7));
        user.setPassword(password != null ? DigestUtils.md5DigestAsHex(password.getBytes()) : null);
        user.setRegisterTime(LocalDateTime.now());
        user.setLevel(0);
        user.setBalance(java.math.BigDecimal.ZERO);
        user.setStatus(1);
        user.setDeleted(0);
        userMapper.insert(user);
        return user.getId();
    }

    public Long registerWithEmail(String email, String nickname, String password) {
        UserInfo user = new UserInfo();
        user.setEmail(email);
        user.setNickname(nickname != null ? nickname : email.split("@")[0]);
        user.setPassword(password != null ? DigestUtils.md5DigestAsHex(password.getBytes()) : null);
        user.setRegisterTime(LocalDateTime.now());
        user.setLevel(0);
        user.setBalance(java.math.BigDecimal.ZERO);
        user.setStatus(1);
        user.setDeleted(0);
        userMapper.insert(user);
        return user.getId();
    }

    public Long registerWithThirdParty(String platform, String openId, String nickname, String avatar) {
        UserInfo user = new UserInfo();
        user.setNickname(nickname != null ? nickname : platform + "用户" + (int) (Math.random() * 10000));
        user.setAvatar(avatar != null ? avatar : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + System.currentTimeMillis());
        user.setThirdPartyPlatform(platform);
        user.setThirdPartyOpenid(openId);
        user.setRegisterTime(LocalDateTime.now());
        user.setLevel(0);
        user.setBalance(java.math.BigDecimal.ZERO);
        user.setStatus(1);
        user.setDeleted(0);
        userMapper.insert(user);
        return user.getId();
    }

    public UserInfo loginWithAccount(String account, String password) {
        LambdaQueryWrapper<UserInfo> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserInfo::getAccount, account);
        wrapper.eq(UserInfo::getPassword, DigestUtils.md5DigestAsHex(password.getBytes()));
        return userMapper.selectOne(wrapper);
    }

    public UserInfo findByAccount(String account) {
        LambdaQueryWrapper<UserInfo> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserInfo::getAccount, account);
        return userMapper.selectOne(wrapper);
    }

    public UserInfo findByPhone(String phone) {
        LambdaQueryWrapper<UserInfo> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserInfo::getPhone, phone);
        return userMapper.selectOne(wrapper);
    }

    public UserInfo findByEmail(String email) {
        LambdaQueryWrapper<UserInfo> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserInfo::getEmail, email);
        return userMapper.selectOne(wrapper);
    }

    public UserInfo findByThirdParty(String platform, String openId) {
        LambdaQueryWrapper<UserInfo> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserInfo::getThirdPartyPlatform, platform);
        wrapper.eq(UserInfo::getThirdPartyOpenid, openId);
        return userMapper.selectOne(wrapper);
    }

    public String generateToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    public boolean updateUser(UserInfo user) {
        return userMapper.updateById(user) > 0;
    }
}
