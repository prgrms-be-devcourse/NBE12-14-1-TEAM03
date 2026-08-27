package com.programmers.be14.nbe12141team03.domain.image.controller;

import com.programmers.be14.nbe12141team03.domain.image.dto.ImageUploadResponse;
import com.programmers.be14.nbe12141team03.domain.image.service.ImageService;
import com.programmers.be14.nbe12141team03.global.dto.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService imageService;

    @Tag(name = "공용")
    @Operation(
            summary = "이미지 업로드",
            description = "PNG, JPG, WebP 형식의 이미지 파일을 업로드하고 정적 리소스 접근 경로(photoUrl)를 반환합니다."
    )
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public RsData<ImageUploadResponse> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        ImageUploadResponse response = imageService.uploadImage(file);

        return new RsData<>(
                "200-1",
                "이미지가 성공적으로 업로드되었습니다.",
                response
        );
    }
}
