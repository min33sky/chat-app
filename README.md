# Chat-app

> 채팅 앱 😂

## 모듈

- react
- redux
- styledComponents
- firebase

## 문제 및 해결

1. `firebase`의 이벤트 리스너를 다룰 때, 특히 `child_removed`를 사용할 때 상태값을 건들 경우 무한 리랜더링이 발생했다. 💢

- 해결 : `child_remove` 대신 `value`를 사용해 직접 데이터를 가져와서 상태값을 변경하였다.
