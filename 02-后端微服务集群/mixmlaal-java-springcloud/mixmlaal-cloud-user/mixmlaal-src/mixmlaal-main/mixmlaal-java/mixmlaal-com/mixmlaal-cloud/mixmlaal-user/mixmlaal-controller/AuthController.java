package com.cloud.user.controller;

import com.cloud.common.core.R;
import com.cloud.user.entity.UserInfo;
import com.cloud.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    private static final Map<String, Map<String, Object>> verificationCodes = new ConcurrentHashMap<>();

    @PostMapping("/send-code")
    public R<Map<String, Object>> sendCode(@RequestBody Map<String, String> params) {
        String phone = params.get("phone");
        String email = params.get("email");

        if (phone == null && email == null) {
            return R.fail("请提供手机号或邮箱");
        }

        if (phone != null && !phone.matches("^1[3-9]\\d{9}$")) {
            return R.fail("手机号格式不正确");
        }

        if (email != null && !email.matches("^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$")) {
            return R.fail("邮箱格式不正确");
        }

        String code = String.format("%06d", (int) ((Math.random() * 900000) + 100000));
        long expire = System.currentTimeMillis() + 300000;

        Map<String, Object> codeInfo = new HashMap<>();
        codeInfo.put("code", code);
        codeInfo.put("expire", expire);

        if (phone != null) {
            verificationCodes.put(phone, codeInfo);
            String maskedPhone = phone.substring(0, 3) + "****" + phone.substring(7);
            Map<String, Object> result = new HashMap<>();
            result.put("code", code);
            result.put("expire", 300);
            result.put("message", "验证码已发送至手机 " + maskedPhone);
            return R.ok(result);
        } else {
            verificationCodes.put(email, codeInfo);
            String[] parts = email.split("@");
            String maskedEmail = email.substring(0, 3) + "****" + parts[0].substring(parts[0].length() - 3) + "@" + parts[1];
            Map<String, Object> result = new HashMap<>();
            result.put("code", code);
            result.put("expire", 300);
            result.put("message", "验证码已发送至邮箱 " + maskedEmail);
            return R.ok(result);
        }
    }

    @PostMapping("/register")
    public R<Map<String, Object>> register(@RequestBody Map<String, String> params) {
        String registerType = params.get("registerType");
        String account = params.get("account");
        String nickname = params.get("nickname");
        String password = params.get("password");
        String phone = params.get("phone");
        String email = params.get("email");
        String verifyCode = params.get("verifyCode");

        if ("account".equals(registerType)) {
            if (account == null || password == null) {
                return R.fail("账号和密码不能为空");
            }

            UserInfo existUser = userService.findByAccount(account);
            if (existUser != null) {
                return R.fail("账号已存在");
            }

            Long userId = userService.registerWithAccount(account, nickname, password);
            Map<String, Object> result = new HashMap<>();
            result.put("userId", userId);
            result.put("account", account);
            result.put("nickname", nickname != null ? nickname : account);
            result.put("message", "注册成功");
            return R.ok(result);

        } else if ("phone".equals(registerType)) {
            if (phone == null || verifyCode == null) {
                return R.fail("手机号和验证码不能为空");
            }

            if (!validateCode(phone, verifyCode)) {
                return R.fail("验证码错误或已过期");
            }

            UserInfo existUser = userService.findByPhone(phone);
            if (existUser != null) {
                return R.fail("该手机号已注册");
            }

            Long userId = userService.registerWithPhone(phone, nickname, password);
            Map<String, Object> result = new HashMap<>();
            result.put("userId", userId);
            result.put("phone", phone);
            result.put("nickname", nickname != null ? nickname : "用户" + phone.substring(7));
            result.put("message", "注册成功");
            return R.ok(result);

        } else if ("email".equals(registerType)) {
            if (email == null || verifyCode == null) {
                return R.fail("邮箱和验证码不能为空");
            }

            if (!validateCode(email, verifyCode)) {
                return R.fail("验证码错误或已过期");
            }

            UserInfo existUser = userService.findByEmail(email);
            if (existUser != null) {
                return R.fail("该邮箱已注册");
            }

            Long userId = userService.registerWithEmail(email, nickname, password);
            Map<String, Object> result = new HashMap<>();
            result.put("userId", userId);
            result.put("email", email);
            result.put("nickname", nickname != null ? nickname : email.split("@")[0]);
            result.put("message", "注册成功");
            return R.ok(result);
        }

        return R.fail("不支持的注册类型");
    }

    @PostMapping("/login")
    public R<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        String loginType = params.get("loginType");
        String account = params.get("account");
        String password = params.get("password");
        String phone = params.get("phone");
        String email = params.get("email");
        String verifyCode = params.get("verifyCode");

        if ("account".equals(loginType)) {
            if (account == null || password == null) {
                return R.fail("账号和密码不能为空");
            }

            UserInfo user = userService.loginWithAccount(account, password);
            if (user == null) {
                return R.fail("账号或密码错误");
            }

            String token = userService.generateToken();
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("userInfo", user);
            result.put("loginType", "account");
            return R.ok(result);

        } else if ("phone".equals(loginType)) {
            if (phone == null || verifyCode == null) {
                return R.fail("手机号和验证码不能为空");
            }

            if (!validateCode(phone, verifyCode)) {
                return R.fail("验证码错误或已过期");
            }

            UserInfo user = userService.findByPhone(phone);
            if (user == null) {
                return R.fail("该手机号未注册");
            }

            String token = userService.generateToken();
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("userInfo", user);
            result.put("loginType", "phone");
            return R.ok(result);

        } else if ("email".equals(loginType)) {
            if (email == null || verifyCode == null) {
                return R.fail("邮箱和验证码不能为空");
            }

            if (!validateCode(email, verifyCode)) {
                return R.fail("验证码错误或已过期");
            }

            UserInfo user = userService.findByEmail(email);
            if (user == null) {
                return R.fail("该邮箱未注册");
            }

            String token = userService.generateToken();
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("userInfo", user);
            result.put("loginType", "email");
            return R.ok(result);
        }

        return R.fail("不支持的登录类型");
    }

    @PostMapping("/third-party-login")
    public R<Map<String, Object>> thirdPartyLogin(@RequestBody Map<String, String> params) {
        String platform = params.get("platform");
        String openId = params.get("openId");
        String nickname = params.get("nickname");
        String avatar = params.get("avatar");

        if (platform == null || openId == null) {
            return R.fail("平台和openId不能为空");
        }

        UserInfo user = userService.findByThirdParty(platform, openId);
        boolean isNewUser = false;

        if (user == null) {
            isNewUser = true;
            Long userId = userService.registerWithThirdParty(platform, openId, nickname, avatar);
            user = userService.getById(userId);
        }

        String token = userService.generateToken();
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userInfo", user);
        result.put("loginType", "thirdparty_" + platform);
        result.put("isNewUser", isNewUser);
        return R.ok(result);
    }

    @GetMapping("/third-party-url")
    public R<Map<String, Object>> getThirdPartyUrl(@RequestParam String platform) {
        Map<String, String> urls = new HashMap<>();
        urls.put("wechat", "https://open.weixin.qq.com/connect/qrconnect?appid=wx&response_type=code&redirect_uri=...");
        urls.put("qq", "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101&redirect_uri=...");
        urls.put("weibo", "https://api.weibo.com/oauth2/authorize?response_type=code&client_id=123&redirect_uri=...");
        urls.put("alipay", "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021&scope=auth_user&redirect_uri=...");
        urls.put("baidu", "https://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=...");
        urls.put("douyin", "https://open.douyin.com/oauth/authorize?client_key=...&redirect_uri=...");
        urls.put("xiaomi", "https://account.xiaomi.com/oauth2/authorize?client_id=...&redirect_uri=...");
        urls.put("apple", "https://appleid.apple.com/auth/authorize?client_id=...&redirect_uri=...");

        if (!urls.containsKey(platform)) {
            return R.fail("不支持的第三方平台");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("platform", platform);
        result.put("url", urls.get(platform));
        result.put("message", "请使用此URL进行授权");
        return R.ok(result);
    }

    @PostMapping("/logout")
    public R<Map<String, Object>> logout() {
        Map<String, Object> result = new HashMap<>();
        result.put("message", "登出成功");
        return R.ok(result);
    }

    @PostMapping("/bind-phone")
    public R<Map<String, Object>> bindPhone(@RequestBody Map<String, String> params) {
        String phone = params.get("phone");
        String code = params.get("code");

        if (phone == null || code == null) {
            return R.fail("手机号和验证码不能为空");
        }

        if (!validateCode(phone, code)) {
            return R.fail("验证码错误或已过期");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("message", "手机号绑定成功");
        return R.ok(result);
    }

    @PostMapping("/bind-email")
    public R<Map<String, Object>> bindEmail(@RequestBody Map<String, String> params) {
        String email = params.get("email");
        String code = params.get("code");

        if (email == null || code == null) {
            return R.fail("邮箱和验证码不能为空");
        }

        if (!validateCode(email, code)) {
            return R.fail("验证码错误或已过期");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("message", "邮箱绑定成功");
        return R.ok(result);
    }

    @PostMapping("/reset-password")
    public R<Map<String, Object>> resetPassword(@RequestBody Map<String, String> params) {
        String phone = params.get("phone");
        String email = params.get("email");
        String code = params.get("code");
        String newPassword = params.get("newPassword");

        if (code == null || newPassword == null) {
            return R.fail("验证码和新密码不能为空");
        }

        if (phone != null) {
            if (!validateCode(phone, code)) {
                return R.fail("验证码错误或已过期");
            }
        } else if (email != null) {
            if (!validateCode(email, code)) {
                return R.fail("验证码错误或已过期");
            }
        } else {
            return R.fail("请提供手机号或邮箱");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("message", "密码重置成功");
        return R.ok(result);
    }

    private boolean validateCode(String key, String code) {
        Map<String, Object> codeInfo = verificationCodes.get(key);
        if (codeInfo == null) {
            return false;
        }
        String storedCode = (String) codeInfo.get("code");
        long expire = (Long) codeInfo.get("expire");
        if (storedCode.equals(code) && System.currentTimeMillis() < expire) {
            verificationCodes.remove(key);
            return true;
        }
        return false;
    }
}
