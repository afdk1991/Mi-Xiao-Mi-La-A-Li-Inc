package com.cloud.order.controller;

import com.cloud.common.core.R;
import com.cloud.order.entity.OrderMain;
import com.cloud.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/list")
    public R<List<OrderMain>> list() {
        return R.ok(orderService.list());
    }

    @GetMapping("/{id}")
    public R<OrderMain> getById(@PathVariable Long id) {
        return R.ok(orderService.getById(id));
    }

    @GetMapping("/user/{userId}")
    public R<List<OrderMain>> getByUserId(@PathVariable Long userId) {
        return R.ok(orderService.getByUserId(userId));
    }

    @PostMapping("/create")
    public R<OrderMain> create(@RequestBody OrderMain order) {
        return R.ok(orderService.createOrder(order));
    }

    @PutMapping("/pay/{orderNo}")
    public R<Boolean> pay(@PathVariable String orderNo) {
        return R.ok(orderService.payOrder(orderNo));
    }

    @PutMapping("/cancel/{orderNo}")
    public R<Boolean> cancel(@PathVariable String orderNo) {
        return R.ok(orderService.cancelOrder(orderNo));
    }
}
