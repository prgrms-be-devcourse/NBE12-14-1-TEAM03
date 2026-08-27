package com.programmers.be14.nbe12141team03.domain.image.service;

import com.programmers.be14.nbe12141team03.domain.image.dto.ImageUploadResponse;
import com.programmers.be14.nbe12141team03.global.exception.ApiServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class ImageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("png", "jpg", "jpeg", "webp");
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp"
    );

    @Value("${custom.upload.image-dir:images/}")
    private String imageDir;

    public ImageUploadResponse uploadImage(MultipartFile file) {
        validateFile(file);

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new ApiServiceException("400-2", "올바르지 않은 파일명입니다.");
        }

        String extension = extractExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ApiServiceException("400-3", "지원하지 않는 이미지 확장자입니다. (지원 형식: PNG, JPG, JPEG, WebP)");
        }

        String cleanFilename = Paths.get(originalFilename).getFileName().toString()
                .replaceAll("[^a-zA-Z0-9._-]", "_");
        String savedFileName = UUID.randomUUID() + "_" + cleanFilename;

        Path uploadPath = Paths.get(imageDir).toAbsolutePath();

        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path targetLocation = uploadPath.resolve(savedFileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            log.error("이미지 파일 저장 실패: {}", e.getMessage(), e);
            throw new ApiServiceException("500-1", "이미지 파일 저장 중 오류가 발생했습니다.");
        }

        String photoUrl = "/images/" + savedFileName;

        return new ImageUploadResponse(
                photoUrl,
                originalFilename,
                savedFileName,
                file.getSize()
        );
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiServiceException("400-1", "업로드할 이미지 파일이 비어있습니다.");
        }

        String contentType = file.getContentType();
        if (contentType != null && !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new ApiServiceException("400-4", "지원하지 않는 이미지 MIME 타입입니다.");
        }
    }

    private String extractExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1).toLowerCase();
    }
}
