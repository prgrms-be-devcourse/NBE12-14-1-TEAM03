plugins {
    java
    id("org.springframework.boot") version "4.1.1"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.programmers.be14"
version = "0.0.1-SNAPSHOT"
description = "NBE12-14-1-TEAM03"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    annotationProcessor("org.projectlombok:lombok")
    compileOnly("org.projectlombok:lombok")
    implementation("io.github.cdimascio:dotenv-java:3.2.0")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:3.1.0")
    implementation("org.springframework.boot:spring-boot-h2console")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-webmvc")
    runtimeOnly("com.h2database:h2")
    testAnnotationProcessor("org.projectlombok:lombok")
    testAnnotationProcessor("org.projectlombok:lombok")
    testCompileOnly("org.projectlombok:lombok")
    testCompileOnly("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
