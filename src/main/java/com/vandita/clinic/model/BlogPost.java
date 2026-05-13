package com.vandita.clinic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogPost {
    private String id;
    private String title;
    private String category;
    private String content;
    private String excerpt;
    private String coverImageUrl;
    private String tags;
    private String readTime;
    private String createdAt;
    private boolean published;
    private String slug;
    private String author;
}
