package com.cloud.order.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloud.order.entity.OrderMain;
import com.cloud.order.mapper.OrderMainMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderMainMapper orderMapper;

    public List<OrderMain> getByUserId(Long userId) {
        LambdaQueryWrapper<OrderMain> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(OrderMain::getUserId, userId);
        wrapper.isNull(OrderMain::getDeleteTime);
        wrapper.orderByDesc(OrderMain::getCreateTime);
        return orderMapper.selectList(wrapper);
    }

    @Transactional
    public OrderMain createOrder(OrderMain order) {
        order.setOrderNo(UUID.randomUUID().toString().replace("-", ""));
        order.setStatus(0);
        order.setCreateTime(LocalDateTime.now());
        orderMapper.insert(order);
        return order;
    }

    @Transactional
    public boolean payOrder(String orderNo) {
        LambdaQueryWrapper<OrderMain> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(OrderMain::getOrderNo, orderNo);
        OrderMain order = orderMapper.selectOne(wrapper);
        if (order != null && order.getStatus() == 0) {
            order.setStatus(1);
            order.setPayTime(LocalDateTime.now());
            return orderMapper.updateById(order) > 0;
        }
        return false;
    }

    @Transactional
    public boolean cancelOrder(String orderNo) {
        LambdaQueryWrapper<OrderMain> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(OrderMain::getOrderNo, orderNo);
        OrderMain order = orderMapper.selectOne(wrapper);
        if (order != null && order.getStatus() == 0) {
            order.setDeleteTime(LocalDateTime.now());
            return orderMapper.updateById(order) > 0;
        }
        return false;
    }
}
