package com.vandita.clinic.controller;

import com.vandita.clinic.model.BlogPost;
import com.vandita.clinic.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping
    public List<BlogPost> getPublished() {
        return blogService.findPublished();
    }

    @GetMapping("/all")
    public List<BlogPost> getAll() {
        return blogService.findAll();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogPost> getBySlug(@PathVariable String slug) {
        return blogService.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public BlogPost create(@RequestBody BlogPost post) {
        return blogService.create(post);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPost> update(@PathVariable String id, @RequestBody BlogPost post) {
        return blogService.update(id, post)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (blogService.delete(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
