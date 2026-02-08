/**
 * 도시별 격자 좌표 데이터 (nx, ny)
 */
export const CITIES = [
    { name: '서울', nx: 60, ny: 127, id: 'seoul' },
    { name: '부산', nx: 98, ny: 76, id: 'busan' },
    { name: '대구', nx: 89, ny: 90, id: 'daegu' },
    { name: '인천', nx: 55, ny: 124, id: 'incheon' },
    { name: '광주', nx: 58, ny: 74, id: 'gwangju' },
];

/**
 * 기상청 단기예보 발표 시각
 */
const BASE_TIMES = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];

/**
 * 현재 시간 기준 최신 base_date와 base_time 계산 로직
 * - 10분 지연 공표 고려
 * - 발표 시간 10분 이후부터 조회 가능
 */
export const getBaseDateTime = () => {
    const now = new Date();
    let baseDate = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');

    const hour = now.getHours();
    const minute = now.getMinutes();

    // 1단계: 10분 지연 처리 (분 단위 확인)
    // 현재 분이 10분 미만이면 이전 시간대 데이터를 가져와야 함
    const adjustedHour = minute < 10 ? hour - 1 : hour;

    // 2단계: 기준 시간(Base Time) 찾기
    // adjustedHour보다 작거나 같은 가장 최근의 발표 시각을 찾음
    let baseTime = '2300'; // 기본값 (심야 시간대 대비)

    for (let i = BASE_TIMES.length - 1; i >= 0; i--) {
        if (parseInt(BASE_TIMES[i]) / 100 <= adjustedHour) {
            baseTime = BASE_TIMES[i];
            break;
        }
    }

    // 3단계: 날짜 변경 처리 (02:10 이전인 경우 전날 데이터 사용)
    if (adjustedHour < 2 || (adjustedHour === 2 && minute < 10)) {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        baseDate = yesterday.getFullYear() +
            String(yesterday.getMonth() + 1).padStart(2, '0') +
            String(yesterday.getDate()).padStart(2, '0');
        baseTime = '2300';
    }

    return { baseDate, baseTime };
};

/**
 * SKY/PTY 코드에 따른 날씨 상태 및 아이콘/색상 매핑
 */
export const getWeatherStatus = (sky, pty) => {
    const ptyCode = parseInt(pty);
    const skyCode = parseInt(sky);

    // 1. PTY 우선순위 (강수 형태)
    if (ptyCode === 1) return { text: '비', icon: 'CloudRain', color: 'from-blue-400/30 to-blue-600/30' };
    if (ptyCode === 2) return { text: '비/눈', icon: 'CloudRainWind', color: 'from-blue-300/30 to-slate-400/30' };
    if (ptyCode === 3) return { text: '눈', icon: 'CloudSnow', color: 'from-slate-100/30 to-slate-300/30' };
    if (ptyCode === 4) return { text: '소나기', icon: 'CloudDrizzle', color: 'from-indigo-400/30 to-indigo-600/30' };

    // 2. SKY 순위 (강수 없을 때)
    if (skyCode === 1) return { text: '맑음', icon: 'Sun', color: 'from-yellow-200/30 to-orange-400/30' };
    if (skyCode === 3) return { text: '구름많음', icon: 'CloudSun', color: 'from-slate-200/30 to-slate-400/30' };
    if (skyCode === 4) return { text: '흐림', icon: 'Cloud', color: 'from-slate-400/30 to-slate-600/30' };

    return { text: '정보없음', icon: 'HelpCircle', color: 'from-slate-200/10 to-slate-400/10' };
};
