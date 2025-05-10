package com.evotickets.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

public class QRGenerator {
    
    public static void generateQR(String content, String filePath) throws WriterException, IOException {
        // Create QR code writer
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        
        // Generate QR code matrix
        BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, 200, 200);
        
        // Ensure directory exists
        Path path = Paths.get(filePath);
        Files.createDirectories(path.getParent());
        
        // Write QR code to file
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
    }
}
