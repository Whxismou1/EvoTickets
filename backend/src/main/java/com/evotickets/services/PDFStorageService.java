package com.evotickets.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class PDFStorageService {

    @Value("${b2.bucket-name}")
    private String bucketName;

    private final S3Client s3Client;

    public PDFStorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadPDF(MultipartFile file, String keyName)
            throws Exception {

        System.out.println("Uploading file service: " + file.getOriginalFilename());
        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(keyName)
                .contentType("application/pdf")
                .build();

        System.out.println("Uploading file to S3: " + file.getOriginalFilename());
        s3Client.putObject(req, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        System.out.println("File uploaded successfully: " + file.getOriginalFilename());

        return s3Client.utilities().getUrl(GetUrlRequest.builder().bucket(bucketName).key(keyName).build())
                .toExternalForm();
    }

}
