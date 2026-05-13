package com.vandita.clinic.service;

import com.vandita.clinic.model.BlogPost;
import com.vandita.clinic.store.InMemoryStore;
import com.vandita.clinic.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BlogService {

    @Autowired private InMemoryStore store;
    @Autowired private IdGenerator idGen;

    public List<BlogPost> findPublished() {
        return store.blogPosts.stream()
            .filter(BlogPost::isPublished)
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .collect(Collectors.toList());
    }

    public List<BlogPost> findAll() {
        return store.blogPosts.stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .collect(Collectors.toList());
    }

    public Optional<BlogPost> findBySlug(String slug) {
        return store.blogPosts.stream().filter(p -> p.getSlug().equals(slug)).findFirst();
    }

    public Optional<BlogPost> findById(String id) {
        return store.blogPosts.stream().filter(p -> p.getId().equals(id)).findFirst();
    }

    public BlogPost create(BlogPost post) {
        post.setId(idGen.uuid());
        if (post.getCreatedAt() == null) post.setCreatedAt(LocalDate.now().toString());
        if (post.getAuthor() == null) post.setAuthor("Dr. Vandita");
        if (post.getSlug() == null || post.getSlug().isBlank()) {
            post.setSlug(post.getTitle().toLowerCase()
                .replaceAll("[^a-z0-9 ]", "").replaceAll("\\s+", "-"));
        }
        store.blogPosts.add(post);
        return post;
    }

    public Optional<BlogPost> update(String id, BlogPost updated) {
        Optional<BlogPost> opt = findById(id);
        opt.ifPresent(p -> {
            p.setTitle(updated.getTitle());
            p.setCategory(updated.getCategory());
            p.setContent(updated.getContent());
            p.setExcerpt(updated.getExcerpt());
            p.setCoverImageUrl(updated.getCoverImageUrl());
            p.setTags(updated.getTags());
            p.setReadTime(updated.getReadTime());
            p.setPublished(updated.isPublished());
            if (updated.getSlug() != null && !updated.getSlug().isBlank())
                p.setSlug(updated.getSlug());
        });
        return opt;
    }

    public boolean delete(String id) {
        return store.blogPosts.removeIf(p -> p.getId().equals(id));
    }
}
