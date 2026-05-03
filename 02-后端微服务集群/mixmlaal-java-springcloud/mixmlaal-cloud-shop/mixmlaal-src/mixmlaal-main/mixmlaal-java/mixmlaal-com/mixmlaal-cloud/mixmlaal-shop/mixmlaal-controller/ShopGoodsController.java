package com.cloud.shop.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cloud.common.core.R;
import com.cloud.shop.entity.ShopGoods;
import com.cloud.shop.service.ShopGoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/goods")
public class ShopGoodsController {

    @Autowired
    private ShopGoodsService goodsService;

    @GetMapping("/list")
    public R<Map<String, Object>> getGoodsList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long categoryId) {
        Page<ShopGoods> result = goodsService.getGoodsList(page, pageSize, categoryId);
        Map<String, Object> data = new HashMap<>();
        data.put("list", result.getRecords());
        data.put("total", result.getTotal());
        return R.ok(data);
    }

    @GetMapping("/{id}")
    public R<ShopGoods> getGoodsDetail(@PathVariable Long id) {
        return R.ok(goodsService.getGoodsDetail(id));
    }

    @PostMapping("/add")
    public R<Boolean> addGoods(@RequestBody ShopGoods goods) {
        return R.ok(goodsService.addGoods(goods), "添加成功");
    }

    @PutMapping("/{id}")
    public R<Boolean> updateGoods(@PathVariable Long id, @RequestBody ShopGoods goods) {
        return R.ok(goodsService.updateGoods(id, goods), "更新成功");
    }

    @DeleteMapping("/{id}")
    public R<Boolean> deleteGoods(@PathVariable Long id) {
        return R.ok(goodsService.deleteGoods(id), "删除成功");
    }

    @PutMapping("/{id}/onShelf")
    public R<Boolean> onShelf(@PathVariable Long id) {
        return R.ok(goodsService.onShelf(id), "上架成功");
    }

    @PutMapping("/{id}/offShelf")
    public R<Boolean> offShelf(@PathVariable Long id) {
        return R.ok(goodsService.offShelf(id), "下架成功");
    }

    @GetMapping("/hot")
    public R<List<ShopGoods>> getHotGoods() {
        return R.ok(goodsService.getHotGoods());
    }

    @GetMapping("/recommend")
    public R<List<ShopGoods>> getRecommendGoods() {
        return R.ok(goodsService.getRecommendGoods());
    }
}
