package com.cloud.shop.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cloud.shop.entity.ShopGoods;
import com.cloud.shop.mapper.ShopGoodsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShopGoodsService {

    @Autowired
    private ShopGoodsMapper goodsMapper;

    public Page<ShopGoods> getGoodsList(int page, int pageSize, Long categoryId) {
        Page<ShopGoods> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<ShopGoods> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShopGoods::getDeleted, 0);
        if (categoryId != null) {
            wrapper.eq(ShopGoods::getCategoryId, categoryId);
        }
        wrapper.orderByDesc(ShopGoods::getCreateTime);
        return goodsMapper.selectPage(pageParam, wrapper);
    }

    public ShopGoods getGoodsDetail(Long id) {
        return goodsMapper.selectById(id);
    }

    public boolean addGoods(ShopGoods goods) {
        goods.setCreateTime(LocalDateTime.now());
        goods.setUpdateTime(LocalDateTime.now());
        goods.setSales(0);
        goods.setStatus(1);
        goods.setDeleted(0);
        return goodsMapper.insert(goods) > 0;
    }

    public boolean updateGoods(Long id, ShopGoods goods) {
        goods.setId(id);
        goods.setUpdateTime(LocalDateTime.now());
        return goodsMapper.updateById(goods) > 0;
    }

    public boolean deleteGoods(Long id) {
        ShopGoods goods = new ShopGoods();
        goods.setId(id);
        goods.setDeleted(1);
        goods.setUpdateTime(LocalDateTime.now());
        return goodsMapper.updateById(goods) > 0;
    }

    public boolean onShelf(Long id) {
        ShopGoods goods = new ShopGoods();
        goods.setId(id);
        goods.setStatus(1);
        goods.setUpdateTime(LocalDateTime.now());
        return goodsMapper.updateById(goods) > 0;
    }

    public boolean offShelf(Long id) {
        ShopGoods goods = new ShopGoods();
        goods.setId(id);
        goods.setStatus(0);
        goods.setUpdateTime(LocalDateTime.now());
        return goodsMapper.updateById(goods) > 0;
    }

    public List<ShopGoods> getHotGoods() {
        LambdaQueryWrapper<ShopGoods> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShopGoods::getDeleted, 0);
        wrapper.eq(ShopGoods::getStatus, 1);
        wrapper.orderByDesc(ShopGoods::getSales);
        wrapper.last("LIMIT 10");
        return goodsMapper.selectList(wrapper);
    }

    public List<ShopGoods> getRecommendGoods() {
        LambdaQueryWrapper<ShopGoods> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ShopGoods::getDeleted, 0);
        wrapper.eq(ShopGoods::getStatus, 1);
        wrapper.orderByDesc(ShopGoods::getCreateTime);
        wrapper.last("LIMIT 10");
        return goodsMapper.selectList(wrapper);
    }
}
