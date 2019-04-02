package com.test.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.test.entity.User;
import com.test.service.impl.UserServiceImpl;
import com.maccloud.util.ResultMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;

/**
* <p>
    * 用户基本信息表 前端控制器
    * </p>
*
* @author bj
* @since 2019-04-02
*/

@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @RequestMapping(value = "list")
    public String list()
    {
        return "/user/list";
    }

    @RequestMapping(value = "edit")
    public String edit()
    {
        return "/user/edit";
    }

    @ResponseBody
    @RequestMapping(value = "page",method = {RequestMethod.GET,RequestMethod.POST})
    public Map page(@RequestParam(required = false,defaultValue = "1") Integer page
                    ,@RequestParam(required = false,defaultValue = "10") Integer length){
        ResultMap result = new ResultMap(true);
        IPage pagination = new Page(page, length);
        pagination = userService.page(pagination);
        result.setPageResult(pagination);
        return result;
    }

    @ResponseBody
    @RequestMapping(value = "get",method = {RequestMethod.GET,RequestMethod.POST})
    public Map get(Integer id){
        ResultMap result = new ResultMap();
        result.put("data",userService.getById(id));
        return result.setSuccess();
    }

    @ResponseBody
    @RequestMapping(value = "save",method = {RequestMethod.POST})
    public Map save(User user) {
        ResultMap result = new ResultMap();
        boolean flag = false;
        if( user.getId() != null ){
            flag = userService.updateById(user);
        } else{
            flag = userService.save(user);
        }
        return result.setAction(flag);
    }

    @ResponseBody
    @RequestMapping(value = "delete",method = {RequestMethod.GET,RequestMethod.POST})
    public Map del(Integer id) {
        ResultMap result = new ResultMap();
        if(id != null){
            result.setAction(userService.removeById(id));
        }
        return result;
    }

}