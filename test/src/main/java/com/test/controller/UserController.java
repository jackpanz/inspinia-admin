package com.test.controller;

import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.additional.update.impl.UpdateChainWrapper;
import com.test.entity.User;
import com.test.service.impl.UserServiceImpl;
import com.maccloud.util.ResultMap;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Map;
import java.util.UUID;

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

    final static String PATH = "/images";

    final static String FILE_ROOT = "D:/project/inspinia-admin/test/target/inspinia-admin-test-1.0.0/images/";


    @Autowired
    private UserServiceImpl userService;

    @RequestMapping(value = "list")
    public String list() {
        return "/user/list";
    }

    @RequestMapping(value = "edit")
    public String edit() {
        return "/user/edit";
    }

    @ResponseBody
    @RequestMapping(value = "page", method = {RequestMethod.GET, RequestMethod.POST})
    public Map page(@RequestParam(required = false, defaultValue = "1") Integer page
            , @RequestParam(required = false, defaultValue = "10") Integer length) {
        ResultMap result = new ResultMap(true);
        IPage pagination = new Page(page, length);
        pagination = userService.page(pagination);
        result.setPageResult(pagination);
        return result;
    }

    @ResponseBody
    @RequestMapping(value = "get", method = {RequestMethod.GET, RequestMethod.POST})
    public Map get(Integer id) {
        ResultMap result = new ResultMap();
        result.put("data", userService.getById(id));
        return result.setSuccess();
    }

    @ResponseBody
    @RequestMapping(value = "save", method = {RequestMethod.POST})
    public Map save(User user, HttpServletRequest request, String icon_remove) {
        ResultMap result = new ResultMap();
        boolean flag = false;
        user.setIcon(getUploadPath(copyFile(request, "icon")));
        user.setImage(getUploadPath(imgCut(request, "image")));
        if (user.getId() != null) {
            flag = userService.updateById(user);
        } else {
            flag = userService.save(user);
        }
        if ("true".equals(icon_remove)) {
            userService.update(new UpdateWrapper<User>()
                    .set("icon", null)
                    .eq("id", user.getId()
                    ));
        }
        return result.setAction(flag);
    }

    @ResponseBody
    @RequestMapping(value = "delete", method = {RequestMethod.GET, RequestMethod.POST})
    public Map del(Integer id) {
        ResultMap result = new ResultMap();
        if (id != null) {
            result.setAction(userService.removeById(id));
        }
        return result;
    }

    public static File imgCut(HttpServletRequest request, String name) {
        File file = null;
        try {
            MultipartFile multipartFile = ((MultipartRequest) request).getFile(name);
            if (multipartFile != null && !multipartFile.isEmpty()) {
                String suffix = StringUtils.substringAfter(multipartFile.getOriginalFilename(), ".");
                Double x = Double.parseDouble(request.getParameter(name + "_x"));
                Double y = Double.parseDouble(request.getParameter(name + "_y"));
                Double w = Double.parseDouble(request.getParameter(name + "_w"));
                Double h = Double.parseDouble(request.getParameter(name + "_h"));
                BufferedImage bufferedImage = ImageIO.read(multipartFile.getInputStream());
                BufferedImage out = bufferedImage.getSubimage(x.intValue(), y.intValue(), w.intValue(), h.intValue());
                file = new File(FILE_ROOT, UUID.randomUUID().toString() + "." + suffix);
                FileUtils.forceMkdir(file.getParentFile());
                ImageIO.write(out, suffix, file);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return file;
    }

    public static File copyFile(HttpServletRequest request, String name) {
        File file = null;
        try {
            MultipartFile multipartFile = ((MultipartRequest) request).getFile(name);
            if (multipartFile != null && !multipartFile.isEmpty()) {
                String suffix = StringUtils.substringAfter(multipartFile.getOriginalFilename(), ".");
                file = new File(FILE_ROOT, UUID.randomUUID().toString() + "." + suffix);
                FileUtils.forceMkdir(file.getParentFile());
                FileUtils.copyInputStreamToFile(multipartFile.getInputStream(), file);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return file;
    }

    public static String getUploadPath(File file) {
        return file == null ? null : PATH + file.getAbsolutePath().replace(new File(FILE_ROOT).getAbsolutePath(), "").replaceAll("\\\\", "/");
    }

}