package com.programmers.be14.nbe12141team03.domain.image.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class ImageControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    @DisplayName("이미지 업로드 API 성공 테스트")
    void uploadImage_Success() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-coffee.jpg",
                "image/jpeg",
                "fake image content".getBytes()
        );

        String responseBody = mockMvc.perform(multipart("/api/images").file(file))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.data.photoUrl").exists())
                .andExpect(jsonPath("$.data.originalFileName").value("test-coffee.jpg"))
                .andReturn().getResponse().getContentAsString();

        // 생성된 테스트 파일 정리
        try {
            com.jayway.jsonpath.DocumentContext json = com.jayway.jsonpath.JsonPath.parse(responseBody);
            String savedFileName = json.read("$.data.savedFileName");
            if (savedFileName != null) {
                java.nio.file.Files.deleteIfExists(java.nio.file.Paths.get("images", savedFileName));
            }
        } catch (Exception ignored) {
        }
    }
}

