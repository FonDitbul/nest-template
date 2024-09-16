export const UserResetPasswordTemplate = (name: string, email: string, tempPassword: string) => {
  return {
    subject: '임시 비밀번호 변경 안내',
    html: `
  <html lang="">
    <p>${name}님 다음 아이디의 임시비밀번호가 변경되었습니다.</p>
    <br>
   
    <span>아이디 : ${email}</span>
    <br>
    <span>임시 비밀번호 : ${tempPassword}</span>
  </html>
`,
  };
};
