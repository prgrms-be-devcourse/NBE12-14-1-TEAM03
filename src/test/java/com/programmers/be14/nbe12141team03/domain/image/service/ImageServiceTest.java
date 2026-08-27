package com.programmers.be14.nbe12141team03.domain.image.service;

import com.programmers.be14.nbe12141team03.domain.image.dto.ImageUploadResponse;
import com.programmers.be14.nbe12141team03.global.exception.ApiServiceException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ImageServiceTest {

    @TempDir
    Path tempDir;

    private ImageService createServiceWithTempDir() {
        ImageService imageService = new ImageService();
        ReflectionTestUtils.setField(imageService, "imageDir", tempDir.toString());
        return imageService;
    }

    @Test
    @DisplayName("PNG 이미지 업로드 성공")
    void uploadPngImage_Success() {
        ImageService imageService = createServiceWithTempDir();
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-image.png",
                "image/png",
                "dummy image content".getBytes()
        );

        ImageUploadResponse response = imageService.uploadImage(file);

        assertThat(response).isNotNull();
        assertThat(response.getOriginalFileName()).isEqualTo("test-image.png");
        assertThat(response.getPhotoUrl()).startsWith("/images/");
        assertThat(response.getPhotoUrl()).endsWith(".png");
        assertThat(Files.exists(tempDir.resolve(response.getSavedFileName()))).isTrue();
    }

    @Test
    @DisplayName("WebP 이미지 업로드 성공")
    void uploadWebpImage_Success() {
        ImageService imageService = createServiceWithTempDir();
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "coffee.webp",
                "image/webp",
                "dummy webp content".getBytes()
        );

        ImageUploadResponse response = imageService.uploadImage(file);

        assertThat(response).isNotNull();
        assertThat(response.getOriginalFileName()).isEqualTo("coffee.webp");
        assertThat(response.getPhotoUrl()).startsWith("/images/");
        assertThat(response.getPhotoUrl()).endsWith(".webp");
        assertThat(Files.exists(tempDir.resolve(response.getSavedFileName()))).isTrue();
    }

    @Test
    @DisplayName("빈 파일 업로드 시 예외 발생")
    void uploadEmptyFile_ThrowsException() {
        ImageService imageService = createServiceWithTempDir();
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file",
                "empty.png",
                "image/png",
                new byte[0]
        );

        assertThatThrownBy(() -> imageService.uploadImage(emptyFile))
                .isInstanceOf(ApiServiceException.class)
                .hasMessageContaining("업로드할 이미지 파일이 비어있습니다.");
    }

    @Test
    @DisplayName("지원하지 않는 확장자 업로드 시 예외 발생")
    void uploadUnsupportedExtension_ThrowsException() {
        ImageService imageService = createServiceWithTempDir();
        MockMultipartFile txtFile = new MockMultipartFile(
                "file",
                "document.txt",
                "text/plain",
                "hello world".getBytes()
        );

        assertThatThrownBy(() -> imageService.uploadImage(txtFile))
                .isInstanceOf(ApiServiceException.class);
    }
}
