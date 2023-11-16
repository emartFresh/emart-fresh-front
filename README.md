<h1>Pick-fresh24</h1>
<h2>프로젝트 설명</h2>
<p>
	픽업 전문 매장을 컨샙으로 개발한 사이트입니다. 지도, 검색 기반으로 가게를 선택하고, 픽업 주문을 할 수 있습니다.
</p>
<hr/>
<h2>사용한 기술</h2>
<h2>Front-end</h2>
<h4>개발언어</h4>
<ul>
	<li>TypeScript</li>
</ul>
<h4>React</h4>
<ul>
	<li>SPA를 만들기 위한 기반 기술로서 사용</li>
</ul>
<h4>VITE</h4>
<ul>
	<li>프로젝트 관리를 위한 빌드 툴로 사용</li>
</ul>
<h4>Recoil</h4>
<ul>
	<li>React 전역 관리를 위해 사용</li>
</ul>
<h4>React-query</h4>
<ul>
	<li>프로젝트 성능 향상을 위해 사용</li>
</ul>
<hr/>

<h2>Back-end</h2>
<h4>개발언어</h4>
<ul>
	<li>Java</li>
</ul>
<h4>Spring-boot</h4>
<ul>
	<li>Java로 웹서버를 만들고 API를 작성하기 위해 사용</li>
</ul>
<h4>Spring-security</h4>
<ul>
	<li>유저의 인증, 인가 등 보안 관련 작업 및 JWT 관리를 위해 사용</li>
</ul>
<h4>Spring data jpa</h4>
<ul>
	<li>DB에 접근하기 위한 ORM 기술로 사용</li>
</ul>
<hr/>

<h2>Etc</h2>
<h4>Docker</h4>
<ul>
	<li>운영체제에 상관없이 일정한 프로젝트를 컨테이너화해 보여주기 위해 사용</li>
</ul>
<h4>AWS</h4>
<ul>
	<li>Ec2: 서버 배포를 위한 클라우드 컴퓨터로 사용</li>
	<li>Route53: 사이트 도메인 등록을 위해 사용(DNS)</li>
	<li>Certificate Manager: SSL 등록을 위해 사용</li>
	<li>Load balancer: SSL과 결합하여 https 프로토콜 적용을 위해 사용</li>
</ul>
<h4>Git Action</h4>
<ul>
	<li>자동 AWS Ec2로의 자동 배포를 위해 사용</li>
</ul>
<hr/>
<h2>Project architecture</h2>
<img src="https://github.com/emartFresh/emart-fresh-back/assets/76651990/ca69d325-3d19-4670-8764-c97f200d7bdd"/>
<hr/>
<h2>Work flow</h2>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/250e361d-0a0f-4b2c-95cd-bb30054c7382"/>

<h2>프로젝트 설치 및 실행 방법</h2>
<h2>Front-end</h2>
<ol>
	<li>아래 명령어를 순차적으로 실행</li>
	<li>git clone https://github.com/emartFresh/emart-fresh-front.git</li>
	<li>cd Front-end/emart-fresh-app</li>
 	<li>npm i</li>
  	<li>npm run dev(디벨롭 모드, localhost:8080과 연동)</li>
</ol>
<hr/>
<h2>Back-end</h2>
<ol>
	<li>아래 명령어를 순차적으로 실행(localhost의 mysql id:root, pw:1234와 연동)</li>
	<li>git clone https://github.com/emartFresh/emart-fresh-back</li>
	<li>cd emart-fresh-spring/demo</li>
 	<li>mvn clean package</li>
  	<li>java -jar target/jpa-0.0.1-SNAPSHOT.jar</li>
</ol>
<hr/>
<h2>팀원</h2>
<ul>
	<li>정진성 - 팀장/백엔드/프론트엔드(<a href="https://github.com/fkthfvk112/fkthfvk112">깃허브 프로필로 이동</a>)</li>
	<li>김예원 - 프론트엔드</li>
	<li>강창희 - 프론트엔드</li>
	<li>김현민 - 백엔드</li>
	<li>최무진 - 백엔드</li>
</ul>

<hr/>
<h2>요구사항 명세서</h2>
<div>
	<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/e31589ec-0860-4d03-bf5f-f6a5f5dbb956"/>
	<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/d3926b75-6db1-488c-b526-846bed082e81"/>
</div>
<hr/>
<h2>데이터베이스 모델링</h2>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/bbfc99b2-a01d-4683-8881-95825983134c"/>
<hr/>
<h2>기술 스택</h2>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/071d92ca-76df-4e6f-af9b-5f8b5ba24c6a"/>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/e52264d7-a950-4a74-85a1-8658e336df35"/>
<hr/>
<h2>핵심 기능</h2>
<h3>로그인 페이지</h3>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/9a72805f-3ef9-4f06-bf3e-ad9fffaab035"/>
<li>
	<ul>JWT 기반 로그인 지원</ul>
	<ul>OAuth 2.0 기반 카카오, 네이버 로그인</ul>
</li>
<h3>회원가입 페이지</h3>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/e9a56b14-67e8-4758-9276-706fc807db15"/>
<li>
	<ul>SMTP 기반 이메일 인증</ul>
</li>
<h3>전체 상품보기 페이지</h3>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/b2ce3c3c-fe0c-4547-a53a-c6f2b391840e"/>
<li>
	<ul>필터링으로 상품 검색</ul>
	<ul>거리 기반 가게 검색</ul>

</li>
<h3>근처 매장 찾기</h3>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/7c55d516-d70d-4f5f-848b-6d575d857c11"/>
<li>
	<ul>카카오맵 기반 거리 별 가게 검색</ul>
	<ul>민감 정보(유저의 위치) 획득을 위해 HTTPS 적용</ul>

</li>
<h3>결제</h3>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/e8bdd011-95b6-46f4-ba94-c6f1aa011701"/>
<li>
	<ul>부트페이 API연동 실결제 지원</ul>
	<ul>픽업 주문한 물품 확인 및 리뷰, 별점 작성 가능</ul>
</li>
<h3>상품 상세보기</h3>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/de179e04-41fa-401f-a628-7343f43a9eda"/>
<li>
	<ul>픽업 주문한 물품 확인 및 리뷰, 별점 작성 가능</ul>
</li>
<h3>점주 신청</h3>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/5707e1eb-ca99-4142-aa2b-a2016e660a68"/>
<li>
	<ul>네이버 클라우드 플랫폼 연동 OCR 광학 인증</ul>
	<ul>승인 받은 후 점주 권한 획득</ul>
</li>
<h3>점주 승인</h3>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/96bbd867-1367-4243-a88d-ae3dcbb16a09"/>
<li>
	<ul>실제 가게의 기반 위, 경도, 주소 데이터를 백엔드로 전송</ul>
	<ul>일반 유저에게 점주 권한 부여</ul>
</li>
<h3>주문 현황 확인</h3>
<img src="https://github.com/emartFresh/emart-fresh-front/assets/76651990/511aa442-b895-40df-99c0-288df26d92b1"/>
<li>
	<ul>SSE 적용으로 실시간 주문 팝업 및 TTS 생성</ul>
</li>
