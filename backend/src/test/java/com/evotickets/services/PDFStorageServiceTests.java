package com.evotickets.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.net.URL;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Utilities;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

@ExtendWith(MockitoExtension.class)
public class PDFStorageServiceTests {

    @Mock
    private S3Client s3Client;

    @InjectMocks
    private PDFStorageService pdfStorageService;

    private static final String BUCKET_NAME = "test-bucket";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(pdfStorageService, "bucketName", BUCKET_NAME);
    }

    @Test
    public void PDFStorageService_UploadPDF_UploadsSuccessfully() throws Exception {
        // Arrange
        String keyName = "test-key.pdf";
        byte[] fileContent = "test content".getBytes();
        String expectedUrl = "https://" + BUCKET_NAME + ".s3.amazonaws.com/" + keyName;

        MultipartFile file = new MockMultipartFile(
            "file",
            "test.pdf",
            "application/pdf",
            fileContent
        );

        // Mock S3Utilities and its getUrl method
        S3Utilities s3Utilities = mock(S3Utilities.class);
        URL url = new URL(expectedUrl);
        when(s3Client.utilities()).thenReturn(s3Utilities);
        when(s3Utilities.getUrl(any(GetUrlRequest.class))).thenReturn(url);

        // Mock PutObjectResponse
        PutObjectResponse putObjectResponse = PutObjectResponse.builder().build();
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
            .thenReturn(putObjectResponse);

        // Act
        String result = pdfStorageService.uploadPDF(file, keyName);

        // Assert
        assertEquals(expectedUrl, result);
        verify(s3Client).putObject(any(PutObjectRequest.class), any(RequestBody.class));
        verify(s3Utilities).getUrl(any(GetUrlRequest.class));
    }
} 