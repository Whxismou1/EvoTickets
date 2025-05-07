package com.evotickets.utils;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Component
public class ImageUploader {

    private final Cloudinary cloudinary;

    public ImageUploader(@Value("${cloudinary.url}") String cloudinaryUrl) {
        this.cloudinary = new Cloudinary(cloudinaryUrl);
    }

    public String uploadImage(MultipartFile file) throws Exception {
        Map<String, Object> uploadRes = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

        return (String) uploadRes.get("secure_url");

    }
}
