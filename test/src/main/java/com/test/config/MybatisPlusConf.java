package com.test.config;

import com.baomidou.mybatisplus.extension.plugins.OptimisticLockerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import com.baomidou.mybatisplus.extension.spring.MybatisMapperRefresh;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import java.io.IOException;

@Configuration
@MapperScan("com.test.mapper")
public class MybatisPlusConf {

    /**
     * mapper 热更新
     * @param sqlSessionFactory
     * @return
     * @throws IOException
     */
    @Bean
    public MybatisMapperRefresh mybatisMapperRefresh(SqlSessionFactory sqlSessionFactory) throws IOException {
        return new MybatisMapperRefresh(new PathMatchingResourcePatternResolver().getResources("classpath:com/test/mapper/*.xml"),sqlSessionFactory,true);
    }

    /**
     * 分页
     * @return
     */
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        PaginationInterceptor paginationInterceptor = new PaginationInterceptor();
        return paginationInterceptor;
    }

    /**
     * 乐观锁
     * @return
     */
    @Bean
    public OptimisticLockerInterceptor optimisticLockerInterceptor() {
        return new OptimisticLockerInterceptor();
    }

}
