Настройка окружения для современной разработки на TS, настройка тестового окружения 

Домашнее задание

Настроить webpack для работы с typescript, добавить конфигурацию к eslint, решить задачи по типам/TS

Цель:
В результате выполнения ДЗ вы создадите базовый скелет для дальнейшей разработки. Он будет включать в себя настройку babel, webpack, typescript

В задании тренируются навыки

настройки окружения
создания проекта с 0
Необходимо

создать новый репозиторий
инициализировать его с файлом .gitignore
создать новую ветку (чтобы можно было создать PR)
настроить линтинг и actions, настроить автодеплой из PR
сконфигурировать webpack
добавить поддержку ts файлов
добавить поддержку импорта css файлов
реализовать приложение "Игра Жизнь" на языке Typescript https://ru.wikipedia.org/wiki/%D0%98%D0%B3%D1%80%D0%B0_%C2%AB%D0%96%D0%B8%D0%B7%D0%BD%D1%8C%C2%BB
ссылку на задеплоенную страницу и на пуллреквест сбросить в чат с преподавателем
настроить jest и написать тесты на приложение
Критерии оценки:
Игра должна поддерживать отображение нескольких независимых полей на странице (см пример)

Критерии оценки

настроена поддержка typescript через babel - 5
реализовано приложение "Игра Жизнь" - 5 баллов
реализовано взаимодействие с полем (клик по ячейке меняет ее состояние) - 2
реализован автостоп игры, когда все клетки умерли - 2
реализован механизм изменения размеров поля (два input поля (type number)), в тч на лету (при увеличении заполнение мертвыми клетками, при уменьшении просто уничтожения ячеек) - 2
реализован механизм изменения скорости игры (input type=range) - 2
реализована подсветка клеток, которые являясь живыми должны умереть в следующем поколении (например мертвые - белый цвет, живые - черный, обреченные на смерть - синий) - 2
Принято от 16 баллов

Задание не принимается:

без тестов
без настроенного линтинга, хуков, деплоя приложения через github actions