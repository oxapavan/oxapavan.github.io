---
layout: post
title: Automating Pentest using Tool’s & Copilot’s
---

##### Next-Generation Pentesting: AI Copilots and Automation in Practice" explores the seamless integration of artificial intelligence and automation into modern penetration testing workflows. This comprehensive guide demonstrates how security professionals can leverage AI copilots and automated tools to enhance vulnerability detection, streamline assessments, and augment human expertise while maintaining professional oversight. Through practical implementations and real-world case studies, readers will learn to build effective testing frameworks that combine traditional methodologies with cutting-edge AI capabilities.

## Compile LLVM from source

``` shell
git clone git@github.com:llvm/llvm-project.git
pushd llvm-project
    git checkout llvmorg-10.0.1
    mkdir build
    pushd build
        cmake -G "Unix Makefiles" \
            -DLLVM_ENABLE_PROJECTS="clang;libcxx;libcxxabi" \
            -DCMAKE_BUILD_TYPE=DEBUG \
            ../llvm
        cmake --build .
        make -j$(nproc)
    popd
popd
```


## Commands

* Generate LLVM IR: 

```
# Textual form
clang -O1 -emit-llvm input.c -S -o out.ll
# Binary/bit-code form
clang -O1 -emit-llvm input.c -c -o out.bc
```

* Run `HelloWorld` pass with `opt`

``` shell
opt -load-pass-plugin ./libHelloWorld.{so|dylib} -passes=hello-world -disable-output input_for_hello.ll
```
