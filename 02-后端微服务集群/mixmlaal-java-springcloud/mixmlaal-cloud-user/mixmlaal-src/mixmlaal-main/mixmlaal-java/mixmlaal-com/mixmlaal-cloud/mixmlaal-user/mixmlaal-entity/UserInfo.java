package com.cloud.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user_info")
public class UserInfo {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String account;
    private String password;
    private String nickname;
    private String avatar;
    private String phone;
    private String openid;
    private Integer level;
    private java.math.BigDecimal balance;
    private Integer status;
    private LocalDateTime registerTime;
    private Integer deleted;
}
