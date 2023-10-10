Please read **THIS**!
==========
먼저 \~Release MR(Merge Request)이 중복되지 않는지 확인하십시오.

그리고 제목은 "WIP: Release `주버전`.`부버전`.`수버전`" 형태로 작성하며,
`주버전`와 `부버전`, `수버전` 항목을 현재 버전에 맞게 수정하여 작성하십시오.

**하단의 양식을 채운 후에 이 공지를 지우시기 바랍니다.**

------
이 패치(Patch)에서 바뀐 점은 어떤 것입니까?
----------
### Deprecated
<!-- 차후에 제거될 기능 -->

### Fixed
<!-- 수정된 버그 -->

### Security
<!-- 취약점 보안 내용 -->

체크리스트
----------
- [ ] [프로젝트 기여 가이드](CONTRIBUTING.md) 준수
- [ ] 반영이 되지 않은 \~"Pick into `주버전`.`부버전`"의 이슈 확인
- [ ] 병합이 성공한 커밋에 버전 태그 v`주버전`.`부버전`.`수버전` 등록
- [ ] [변경사항](CHANGELOG.md)을 마스터 브랜치에 반영