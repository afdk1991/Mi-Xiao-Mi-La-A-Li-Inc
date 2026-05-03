package com.cloud.shop.controller;

import com.cloud.common.core.R;
import com.cloud.shop.entity.ShopGoods;
import com.cloud.shop.service.ShopGoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goods")
public class GoodsController {

    @Autowired
    private ShopGoodsService goodsService;

    @GetMapping("/list")
    public R<List<ShopGoods>> list() {
        return R.ok(goodsService.list());
    }

    @GetMapping("/{id}")
    public R<ShopGoods> getById(@PathVariable Long id) {
        return R.ok(goodsService.getById(id));
    }

    @GetMapping("/category/{categoryId}")
    public R<List<ShopGoods>> getByCategory(@PathVariable Long categoryId) {
        return R.ok(goodsService.getByCategoryId(categoryId));
    }

    @PostMapping("/add")
    public R<Boolean> add(@RequestBody ShopGoods goods) {
        return R.ok(goodsService.save(goods));
    }

    @PutMapping("/update")
    public R<Boolean> update(@RequestBody ShopGoods goods) {
        return R.ok(goodsService.updateById(goods));
    }

    @DeleteMapping("/{id}")
    public R<Boolean> delete(@PathVariable Long id) {
        return R.ok(goodsService.removeById(id));
    }
}
