package com.test;

import com.maccloud.spring.converter.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;

@Configuration
@SpringBootApplication
public class Application extends SpringBootServletInitializer implements WebMvcConfigurer {

    /**
     * 发布到TOMCAT后模拟web.xml
     * main启动不需要
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(Application.class);
    }

    public static void main(String[] args) throws IOException {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new DateConverter());
        registry.addConverter(new TimeConverter());
        registry.addConverter(new TimestampConverter());
        registry.addConverter(new LocalTimeConverter());
        //解决bean的属性和上传文件同名时，会出现转换错误
        registry.addConverter(new MultipartFileToStringConverter());
    }


}
