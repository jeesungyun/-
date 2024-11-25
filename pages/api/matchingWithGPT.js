import cron from 'node-cron';
import { OpenAI } from 'openai';
import fs from 'fs/promises';

const APPLYMATCHINGS_JSON_FILENAME = 'applyMatchings.json';

// cron job 설정: 매 5분마다 실행
cron.schedule('*/1 * * * *', async () => { // async 추가
    console.log('1분마다 실행되는 서버 측 코드');
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {
        const data = await fs.readFile(APPLYMATCHINGS_JSON_FILENAME, 'utf8'); // await 추가
        const list = JSON.parse(data);

        // OpenAI API에 질문 보내기
        console.log(list);

        // OpenAI API에 질문 보내기
        const response = await openai.chat.completions.create({
            model: 'gpt-4',  // 사용할 모델
            messages: [
                { role: 'system', content: '모임을 만들어주는 서비스에서 너는 각 사람들의 신청 정보를 바탕으로 clustering을 해주는 역할이야.\
                    반드시 모든 신청 사람들을 억지로 다 clustering 할 필요는 없어.\
                    적절한 사람들은 clustering, 이미 시간이 지난 사람은 명단에서 삭제하라고 알려주면돼.\
                    신청 정보는 다음과 같아. [{ applyID, id, interest, timeStart, timeEnd, minHeadCount, maxHeadCount }, ...]\
                    applyID는 신청 정보를 구분하는 고유 번호야. clustering 결과나 삭제 할 신청 정보는 applyID를 알려주면 돼.\
                    id는 신청한 사람의 고유 번호야. 동일한 id를 한 팀에 여러개 넣으면 안돼. 동일한 사람을 여러번 넣는 셈이니까.\
                    interest는 사람들의 관심사야. 관심사가 비슷한 사람끼리 묶어줘야겠지?\
                    timeStart와 timeEnd는 가능한 시간대의 범위를 나타내. 가능한 시간대가 겹치지 않는 사람들을 clustering 해버리면 아주 곤란해.\
                    minHeadCount와 maxHeadCount는 원하는 모임의 명 수를 나타내는 것인데, 이건 신청 정보와 조금 달라도 괜찮아.\
                    응답에는 다음 example을 참고하고, example 외에 다른 말은 절대 하지마. string nested list로 변환할 예정이라 너가 다른 말을 덧붙이면 에러가 떠.\
                    example: [[<동일 cluster의 applyID들>], [<동일 cluster의 applyID들>], ...]'},
                { role: 'user', content: JSON.stringify(list) }
            ],
        });

        // OpenAI의 응답을 클라이언트로 전달
        console.log(response.choices[0].message.content);

    } catch (error) {
        console.error(error);
        console.log('OpenAI API 요청 중 오류가 발생했습니다.');
    }
});

export default function handler(req, res) {
    res.status(200).json({ message: 'Scheduler is running' });
}
